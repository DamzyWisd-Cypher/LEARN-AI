import { useState } from 'react';
import {
  CreditCard, Download, Receipt, AlertTriangle, CheckCircle2,
  Zap, Sparkles, Crown, TrendingUp, Clock, MessageSquare, Video,
  Podcast, Brain, ClipboardList, Upload, HardDrive, ChevronRight, X
} from 'lucide-react';
import { useSubscription, PlanType } from '../hooks/useSubscription';

const planIcons = { free: Zap, pro: Sparkles, premium: Crown };
const planColors = {
  free: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-600/50', gradient: 'from-slate-400 to-slate-500' },
  pro: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', gradient: 'from-indigo-400 to-purple-500' },
  premium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', gradient: 'from-amber-400 to-orange-500' },
};

const featureIcons: Record<string, React.ElementType> = {
  chatMessages: MessageSquare,
  videoMinutes: Video,
  podcastMinutes: Podcast,
  flashcards: Brain,
  quizzes: ClipboardList,
  uploads: Upload,
  storage: HardDrive,
};

const featureLabels: Record<string, string> = {
  chatMessages: 'AI Chat Messages',
  videoMinutes: 'Video Minutes',
  podcastMinutes: 'Podcast Minutes',
  flashcards: 'Flashcards',
  quizzes: 'Quizzes',
  uploads: 'File Uploads',
  storage: 'Storage (MB)',
};



export default function Billing() {
  const { subscription, upgradePlan, cancelSubscription, toggleAutoRenew, getFeatureLimit } = useSubscription();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<PlanType>('pro');
  const [processingUpgrade, setProcessingUpgrade] = useState(false);

  const PlanIcon = planIcons[subscription.plan];
  const colors = planColors[subscription.plan];
  const planPrice = subscription.plan === 'pro' ? 9.99 : subscription.plan === 'premium' ? 19.99 : 0;
  const usageFeatures = Object.keys(subscription.usage) as (keyof typeof subscription.usage)[];

  const handleUpgrade = (plan: PlanType) => {
    setUpgradeTarget(plan);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = () => {
    setProcessingUpgrade(true);
    setTimeout(() => {
      upgradePlan(upgradeTarget);
      setProcessingUpgrade(false);
      setShowUpgradeModal(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Current Plan */}
      <div className={`bg-[#1E293B] border ${colors.border} rounded-xl overflow-hidden`}>
        <div className={`bg-gradient-to-r ${colors.gradient} p-[1px]`}>
          <div className="bg-[#1E293B] rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <PlanIcon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                    </h2>
                    {subscription.plan !== 'free' && subscription.autoRenew && (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    {planPrice === 0 ? 'Free forever' : `$${planPrice.toFixed(2)}/month`}
                    {subscription.plan !== 'free' && subscription.autoRenew && (
                      <span> · Renews {subscription.nextBillingDate || 'N/A'}</span>
                    )}
                    {subscription.plan !== 'free' && !subscription.autoRenew && (
                      <span className="text-amber-400"> · Cancellation pending</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {subscription.plan === 'free' && (
                  <>
                    <button
                      onClick={() => handleUpgrade('pro')}
                      className="flex-1 sm:flex-initial px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-lg hover:opacity-90"
                    >
                      Upgrade to Pro
                    </button>
                    <button
                      onClick={() => handleUpgrade('premium')}
                      className="flex-1 sm:flex-initial px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-lg hover:opacity-90"
                    >
                      Go Premium
                    </button>
                  </>
                )}
                {subscription.plan === 'pro' && (
                  <>
                    <button
                      onClick={() => handleUpgrade('premium')}
                      className="flex-1 sm:flex-initial px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-lg hover:opacity-90"
                    >
                      Go Premium
                    </button>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="px-3 py-2 bg-slate-800 border border-slate-700/50 text-slate-400 text-xs rounded-lg hover:text-white hover:border-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {subscription.plan === 'premium' && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-3 py-2 bg-slate-800 border border-slate-700/50 text-slate-400 text-xs rounded-lg hover:text-white hover:border-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Usage This Month</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            Resets in {subscription.daysRemaining || 30} days
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {usageFeatures.map((feature) => {
            const info = getFeatureLimit(feature);
            const Icon = featureIcons[feature];
            const isUnlimited = info.limit === -1;
            const progressColor = info.isLimitReached
              ? 'from-red-500 to-red-600'
              : info.percentage > 80
                ? 'from-amber-500 to-orange-500'
                : 'from-indigo-500 to-purple-500';

            return (
              <div key={feature} className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium truncate">{featureLabels[feature]}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1.5">
                  <span className="text-lg font-bold text-white">{info.used}</span>
                  <span className="text-xs text-slate-500">/</span>
                  <span className="text-xs text-slate-400">{isUnlimited ? '∞' : info.limit}</span>
                </div>
                {!isUnlimited && (
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${progressColor} rounded-full transition-all`}
                      style={{ width: `${Math.min(info.percentage, 100)}%` }}
                    />
                  </div>
                )}
                {isUnlimited && (
                  <div className="text-[10px] text-emerald-400 font-medium">✨ Unlimited</div>
                )}
                {info.isLimitReached && (
                  <p className="text-[10px] text-red-400 mt-0.5">Limit reached</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method & Billing History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {/* Payment Method */}
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-4">
          <h3 className="text-sm font-bold text-white mb-3">Payment Method</h3>
          {subscription.plan === 'free' ? (
            <div className="text-center py-6">
              <CreditCard className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No payment method on file</p>
              <button
                onClick={() => handleUpgrade('pro')}
                className="mt-3 px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-lg hover:opacity-90"
              >
                Upgrade to Add Payment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700/30 rounded-xl">
                <div className="w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {subscription.paymentMethod.brand === 'Visa' ? 'VISA' : 'MC'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}
                  </p>
                  <p className="text-xs text-slate-400">Expires 12/27</p>
                </div>
                <button className="text-xs text-indigo-400 hover:text-indigo-300">Update</button>
              </div>

              {/* Auto-Renew Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/30 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-white">Auto-Renew</p>
                  <p className="text-xs text-slate-400">
                    {subscription.autoRenew ? 'Automatically renews each month' : 'Will cancel at end of period'}
                  </p>
                </div>
                <button
                  onClick={toggleAutoRenew}
                  className={`relative w-12 h-6 rounded-full transition-colors ${subscription.autoRenew ? 'bg-emerald-500' : 'bg-slate-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${subscription.autoRenew ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* Billing Cycle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/30 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-white">Billing Cycle</p>
                  <p className="text-xs text-slate-400">Monthly billing</p>
                </div>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  Switch to Yearly <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Invoices */}
        <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white">Invoice History</h3>
            <Receipt className="w-5 h-5 text-slate-400" />
          </div>
          {subscription.invoices.length === 0 ? (
            <div className="text-center py-8">
              <Download className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-400">No invoices yet</p>
              <p className="text-xs text-slate-500 mt-1">Invoices appear after your first payment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {subscription.invoices.map((invoice, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/30 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    invoice.status === 'paid' ? 'bg-emerald-500/10' : invoice.status === 'pending' ? 'bg-amber-500/10' : 'bg-red-500/10'
                  }`}>
                    {invoice.status === 'paid' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {invoice.status === 'pending' && <Clock className="w-4 h-4 text-amber-400" />}
                    {invoice.status === 'failed' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{invoice.description}</p>
                    <p className="text-xs text-slate-400">{invoice.date} · {invoice.id}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-white">${invoice.amount.toFixed(2)}</p>
                    <p className={`text-xs font-medium ${
                      invoice.status === 'paid' ? 'text-emerald-400' : invoice.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </p>
                  </div>
                  <button className="p-2 bg-slate-700/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600/50 transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Revenue & Stats for context */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Spent', value: subscription.invoices.reduce((a, b) => a + b.amount, 0).toFixed(2), prefix: '$', icon: CreditCard, color: 'text-indigo-400' },
          { label: 'Days Active', value: '45', icon: Clock, color: 'text-purple-400' },
          { label: 'Resources Created', value: '127', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Avg. Daily Usage', value: '34 min', icon: Zap, color: 'text-amber-400' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-white">
                {stat.prefix || ''}{stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Cancel Subscription?</h3>
                <button onClick={() => setShowCancelModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-200 font-medium">You'll lose access to:</p>
                    <ul className="text-sm text-amber-200/70 mt-2 space-y-1">
                      <li>• Unlimited AI chat, video & podcast generation</li>
                      <li>• All premium programming courses</li>
                      <li>• Advanced flashcard & quiz features</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-6">
                Your access will continue until the end of your billing period. After that, your account will revert to the Free plan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2.5 bg-slate-700/50 border border-slate-600/50 text-white rounded-xl font-medium text-sm hover:bg-slate-700 transition-colors"
                >
                  Keep My Plan
                </button>
                <button
                  onClick={() => {
                    cancelSubscription();
                    setShowCancelModal(false);
                  }}
                  className="flex-1 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-medium text-sm hover:bg-red-500/20 transition-colors"
                >
                  Cancel Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            {processingUpgrade ? (
              <div className="p-12 text-center">
                <div className="w-14 h-14 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6" />
                <p className="text-white font-semibold">Upgrading your plan...</p>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white">
                    Upgrade to {upgradeTarget.charAt(0).toUpperCase() + upgradeTarget.slice(1)}
                  </h3>
                  <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    upgradeTarget === 'premium' ? 'Unlimited AI chat, video & podcasts' : '1,000 chat messages/day',
                    upgradeTarget === 'premium' ? '4K video quality' : '1080p video quality',
                    upgradeTarget === 'premium' ? '100 GB storage' : '10 GB storage',
                    'Full Programming Academy access',
                    'Priority support',
                    upgradeTarget === 'premium' ? 'API access & team collaboration' : '5 custom AI voices',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feat}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Monthly price</span>
                    <span className="text-xl font-bold text-white">${upgradeTarget === 'pro' ? '9.99' : '19.99'}/mo</span>
                  </div>
                </div>
                <button
                  onClick={confirmUpgrade}
                  className={`w-full py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90 ${
                    upgradeTarget === 'pro'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                >
                  Confirm Upgrade — ${upgradeTarget === 'pro' ? '9.99' : '19.99'}/mo
                </button>
                <p className="text-xs text-slate-500 text-center mt-3">7-day free trial. Cancel anytime.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
