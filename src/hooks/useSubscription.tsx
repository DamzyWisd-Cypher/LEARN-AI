import { createContext, useContext, useState, ReactNode } from 'react';

export type PlanType = 'free' | 'pro' | 'premium';

export interface SubscriptionState {
  plan: PlanType;
  daysRemaining: number;
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  paymentMethod: {
    type: 'card' | 'paypal';
    last4?: string;
    brand?: string;
    email?: string;
  };
  usage: {
    chatMessages: { used: number; limit: number };
    videoMinutes: { used: number; limit: number };
    podcastMinutes: { used: number; limit: number };
    flashcards: { used: number; limit: number };
    quizzes: { used: number; limit: number };
    uploads: { used: number; limit: number };
    storage: { used: number; limit: number };
  };
  invoices: {
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    description: string;
  }[];
}

interface SubscriptionContextType {
  subscription: SubscriptionState;
  upgradePlan: (plan: PlanType) => void;
  cancelSubscription: () => void;
  toggleAutoRenew: () => void;
  getFeatureLimit: (feature: keyof SubscriptionState['usage']) => { used: number; limit: number; percentage: number; isLimitReached: boolean };
  isFeatureAvailable: (feature: string) => boolean;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  upgradeModalFeature: string;
  setUpgradeModalFeature: (feature: string) => void;
}

const defaultUsage = {
  chatMessages: { used: 42, limit: 50 },
  videoMinutes: { used: 3, limit: 5 },
  podcastMinutes: { used: 2, limit: 3 },
  flashcards: { used: 45, limit: 50 },
  quizzes: { used: 8, limit: 10 },
  uploads: { used: 3, limit: 5 },
  storage: { used: 128, limit: 500 },
};

const defaultFreeSubscription: SubscriptionState = {
  plan: 'free',
  daysRemaining: 0,
  startDate: '',
  nextBillingDate: '',
  autoRenew: false,
  paymentMethod: { type: 'card' },
  usage: defaultUsage,
  invoices: [],
};

const proSubscription: Partial<SubscriptionState> = {
  plan: 'pro',
  daysRemaining: 27,
  startDate: '2025-01-15',
  nextBillingDate: '2025-02-15',
  autoRenew: true,
  paymentMethod: { type: 'card', last4: '4242', brand: 'Visa' },
  usage: {
    chatMessages: { used: 320, limit: 1000 },
    videoMinutes: { used: 25, limit: 60 },
    podcastMinutes: { used: 18, limit: 45 },
    flashcards: { used: 200, limit: 500 },
    quizzes: { used: 34, limit: 100 },
    uploads: { used: 22, limit: 50 },
    storage: { used: 2400, limit: 10000 },
  },
  invoices: [
    { id: 'INV-001', date: '2025-01-15', amount: 9.99, status: 'paid', description: 'Pro Plan - Monthly' },
  ],
};

const premiumSubscription: Partial<SubscriptionState> = {
  plan: 'premium',
  daysRemaining: 27,
  startDate: '2025-01-15',
  nextBillingDate: '2025-02-15',
  autoRenew: true,
  paymentMethod: { type: 'card', last4: '8888', brand: 'Mastercard' },
  usage: {
    chatMessages: { used: 0, limit: -1 },
    videoMinutes: { used: 0, limit: -1 },
    podcastMinutes: { used: 0, limit: -1 },
    flashcards: { used: 0, limit: -1 },
    quizzes: { used: 0, limit: -1 },
    uploads: { used: 0, limit: -1 },
    storage: { used: 0, limit: -1 },
  },
  invoices: [
    { id: 'INV-002', date: '2025-01-15', amount: 19.99, status: 'paid', description: 'Premium Plan - Monthly' },
  ],
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<SubscriptionState>(defaultFreeSubscription);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalFeature, setUpgradeModalFeature] = useState('');

  const upgradePlan = (plan: PlanType) => {
    const base = plan === 'pro' ? proSubscription : plan === 'premium' ? premiumSubscription : {};
    setSubscription(prev => ({
      ...prev,
      ...base,
      plan,
      startDate: new Date().toISOString().split('T')[0],
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysRemaining: 30,
      autoRenew: true,
      invoices: [
        {
          id: `INV-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          amount: plan === 'pro' ? 9.99 : plan === 'premium' ? 19.99 : 0,
          status: 'paid',
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - Monthly`,
        },
        ...(prev.invoices || []),
      ],
    }));
  };

  const cancelSubscription = () => {
    setSubscription(prev => ({
      ...prev,
      autoRenew: false,
      daysRemaining: 0,
    }));
  };

  const toggleAutoRenew = () => {
    setSubscription(prev => ({ ...prev, autoRenew: !prev.autoRenew }));
  };

  const getFeatureLimit = (feature: keyof SubscriptionState['usage']) => {
    const usage = subscription.usage[feature];
    const limit = usage.limit === -1 ? Infinity : usage.limit;
    const percentage = limit === Infinity ? 0 : Math.round((usage.used / limit) * 100);
    return {
      used: usage.used,
      limit: usage.limit,
      percentage,
      isLimitReached: limit !== Infinity && usage.used >= limit,
    };
  };

  const isFeatureAvailable = (feature: string): boolean => {
    if (subscription.plan === 'premium') return true;
    const featureMap: Record<string, keyof SubscriptionState['usage']> = {
      'chat': 'chatMessages',
      'video': 'videoMinutes',
      'podcast': 'podcastMinutes',
      'flashcard': 'flashcards',
      'quiz': 'quizzes',
      'upload': 'uploads',
      'storage': 'storage',
    };
    const key = featureMap[feature];
    if (!key) return true;
    const info = getFeatureLimit(key);
    return !info.isLimitReached;
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      upgradePlan,
      cancelSubscription,
      toggleAutoRenew,
      getFeatureLimit,
      isFeatureAvailable,
      showUpgradeModal,
      setShowUpgradeModal,
      upgradeModalFeature,
      setUpgradeModalFeature,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
