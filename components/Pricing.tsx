import { useState } from 'react';
import { Check, X, Sparkles, Zap, Crown, Shield, ArrowRight, Star, CreditCard, Smartphone } from 'lucide-react';
import { useSubscription, PlanType } from '../hooks/useSubscription';

const plans = [
  {
    id: 'free' as PlanType,
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    description: 'Get started with basic AI learning tools',
    icon: Zap,
    color: 'from-slate-400 to-slate-500',
    borderColor: 'border-slate-600/50',
    bgAccent: 'bg-slate-500/10',
    textColor: 'text-slate-300',
    popular: false,
    features: [
      { name: 'AI Chat Messages', value: '50/day', included: true },
      { name: 'Video Generation', value: '5 min/day', included: true },
      { name: 'Podcast Creation', value: '3 min/day', included: true },
      { name: 'Flashcards', value: '50 total', included: true },
      { name: 'Quizzes', value: '10/day', included: true },
      { name: 'File Uploads', value: '5 total', included: true },
      { name: 'Storage', value: '500 MB', included: true },
      { name: 'Programming Academy', value: 'Basic', included: true },
      { name: 'AI Video Quality', value: '720p', included: true },
      { name: 'Custom AI Voice', value: '', included: false },
      { name: 'Priority Support', value: '', included: false },
      { name: 'API Access', value: '', included: false },
      { name: 'Team Collaboration', value: '', included: false },
      { name: 'White Label', value: '', included: false },
    ],
  },
  {
    id: 'pro' as PlanType,
    name: 'Pro',
    price: 9.99,
    yearlyPrice: 99.99,
    description: 'Perfect for serious learners and students',
    icon: Sparkles,
    color: 'from-indigo-400 to-purple-500',
    borderColor: 'border-indigo-500/50',
    bgAccent: 'bg-indigo-500/10',
    textColor: 'text-indigo-300',
    popular: true,
    features: [
      { name: 'AI Chat Messages', value: '1,000/day', included: true },
      { name: 'Video Generation', value: '60 min/day', included: true },
      { name: 'Podcast Creation', value: '45 min/day', included: true },
      { name: 'Flashcards', value: '500 total', included: true },
      { name: 'Quizzes', value: '100/day', included: true },
      { name: 'File Uploads', value: '50 total', included: true },
      { name: 'Storage', value: '10 GB', included: true },
      { name: 'Programming Academy', value: 'Full Access', included: true },
      { name: 'AI Video Quality', value: '1080p', included: true },
      { name: 'Custom AI Voice', value: '5 Voices', included: true },
      { name: 'Priority Support', value: '', included: true },
      { name: 'API Access', value: '', included: false },
      { name: 'Team Collaboration', value: '', included: false },
      { name: 'White Label', value: '', included: false },
    ],
  },
  {
    id: 'premium' as PlanType,
    name: 'Premium',
    price: 19.99,
    yearlyPrice: 199.99,
    description: 'For power users, teams, and educators',
    icon: Crown,
    color: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-500/50',
    bgAccent: 'bg-amber-500/10',
    textColor: 'text-amber-300',
    popular: false,
    features: [
      { name: 'AI Chat Messages', value: 'Unlimited', included: true },
      { name: 'Video Generation', value: 'Unlimited', included: true },
      { name: 'Podcast Creation', value: 'Unlimited', included: true },
      { name: 'Flashcards', value: 'Unlimited', included: true },
      { name: 'Quizzes', value: 'Unlimited', included: true },
      { name: 'File Uploads', value: 'Unlimited', included: true },
      { name: 'Storage', value: '100 GB', included: true },
      { name: 'Programming Academy', value: 'Full + Early Access', included: true },
      { name: 'AI Video Quality', value: '4K', included: true },
      { name: 'Custom AI Voice', value: 'All Voices + Clone', included: true },
      { name: 'Priority Support', value: '24/7 Chat', included: true },
      { name: 'API Access', value: 'Full API', included: true },
      { name: 'Team Collaboration', value: 'Up to 10', included: true },
      { name: 'White Label', value: '', included: false },
    ],
  },
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'CS Student',
    avatar: '👩‍💻',
    text: 'The Pro plan paid for itself in a week. AI video explanations saved me hours of studying.',
    rating: 5,
  },
  {
    name: 'James K.',
    role: 'Self-taught Developer',
    avatar: '👨‍🎓',
    text: 'Best investment in my learning journey. The programming academy alone is worth the price.',
    rating: 5,
  },
  {
    name: 'Emily R.',
    role: 'Data Scientist',
    avatar: '👩‍🔬',
    text: 'Premium plan lets me upload entire research papers and create podcasts. Game changer!',
    rating: 5,
  },
];

const faqs = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the change takes effect at the next billing cycle.',
  },
  {
    q: 'Is there a free trial for Pro or Premium?',
    a: 'Yes, both Pro and Premium plans come with a 7-day free trial. No credit card required to start.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. Cancel anytime from your billing page. You\'ll retain access until the end of your billing period.',
  },
  {
    q: 'Do you offer student discounts?',
    a: 'Yes! Students get 50% off any plan with a valid .edu email address. Contact support to activate.',
  },
  {
    q: 'Is my data secure?',
    a: 'We use bank-level 256-bit encryption. Your study materials and data are never shared with third parties.',
  },
];

export default function Pricing() {
  const { subscription, upgradePlan } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === 'free') return;
    if (subscription.plan === planId) return;
    setSelectedPlan(planId);
    setShowPaymentModal(true);
    setPaymentStep('form');
  };

  const handlePayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      upgradePlan(selectedPlan);
    }, 2000);
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Simple, transparent pricing
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
          Choose your learning plan
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Start free and upgrade as you grow. Cancel anytime. No hidden fees.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <span className={`text-xs font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-12 h-6 bg-slate-700 rounded-full transition-colors"
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${billingCycle === 'yearly' ? 'left-7' : 'left-0.5'}`} />
          </button>
          <span className={`text-xs font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
            Yearly
            <span className="ml-1.5 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold rounded-full">Save 17%</span>
          </span>
        </div>
      </div>

      {/* Current Plan Badge */}
      {subscription.plan !== 'free' && (
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">
              You're currently on the <span className="font-bold">{subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}</span> plan
            </span>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrentPlan = subscription.plan === plan.id;
          const price = billingCycle === 'monthly' ? plan.price : plan.yearlyPrice;
          const monthlyEquivalent = billingCycle === 'yearly' && plan.yearlyPrice > 0 
            ? (plan.yearlyPrice / 12).toFixed(2) 
            : null;

          return (
            <div
              key={plan.id}
              className={`relative bg-[#1E293B] border ${plan.popular ? 'border-indigo-500/50 ring-1 ring-indigo-500/20' : 'border-slate-700/50'} rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/20 ${isCurrentPlan ? 'ring-2 ring-emerald-500/30' : ''}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 py-1.5 text-center">
                  <span className="text-white text-xs font-bold tracking-wider uppercase">Most Popular</span>
                </div>
              )}

              <div className={`p-4 ${plan.popular ? 'pt-8' : ''}`}>
                {/* Plan Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    <p className="text-[10px] text-slate-400 leading-tight">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      ${billingCycle === 'monthly' ? price.toFixed(2) : price > 0 ? price.toFixed(2) : '0'}
                    </span>
                    {price > 0 && (
                      <span className="text-slate-400 text-xs">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                    )}
                  </div>
                  {monthlyEquivalent && (
                    <p className="text-[10px] text-slate-500 mt-0.5">${monthlyEquivalent}/mo billed annually</p>
                  )}
                  {price === 0 && (
                    <p className="text-[10px] text-slate-500 mt-0.5">Free forever</p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full py-2 rounded-lg font-semibold text-xs transition-all duration-200 mb-4 ${
                    isCurrentPlan
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : plan.popular
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90'
                        : 'bg-slate-700/50 text-white hover:bg-slate-700 border border-slate-600/50'
                  }`}
                >
                  {isCurrentPlan ? '✓ Current Plan' : plan.id === 'free' ? 'Get Started Free' : 'Upgrade Now'}
                </button>

                {/* Features */}
                <div className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {feature.included ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${feature.included ? 'text-slate-300' : 'text-slate-600'}`}>
                        {feature.name}
                      </span>
                      {feature.included && feature.value && (
                        <span className="text-[10px] text-slate-500 ml-auto">{feature.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50">
          <h2 className="text-base font-bold text-white">Feature Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Feature</th>
                <th className="text-center px-4 py-4 text-sm font-medium text-slate-400">Free</th>
                <th className="text-center px-4 py-4 text-sm font-medium text-indigo-400">
                  <div className="flex flex-col items-center gap-1">
                    <span className="px-2 py-0.5 bg-indigo-500/20 rounded text-xs font-bold">POPULAR</span>
                    Pro — $9.99/mo
                  </div>
                </th>
                <th className="text-center px-4 py-4 text-sm font-medium text-amber-400">Premium — $19.99/mo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {[
                { feature: 'AI Chat', free: '50/day', pro: '1,000/day', premium: 'Unlimited' },
                { feature: 'Video Generation', free: '5 min/day', pro: '60 min/day', premium: 'Unlimited' },
                { feature: 'Podcast Creation', free: '3 min/day', pro: '45 min/day', premium: 'Unlimited' },
                { feature: 'Video Quality', free: '720p', pro: '1080p', premium: '4K' },
                { feature: 'AI Voices', free: '2 basic', pro: '5 voices', premium: 'All + Clone' },
                { feature: 'Flashcard Decks', free: '50 cards', pro: '500 cards', premium: 'Unlimited' },
                { feature: 'Quiz Creation', free: '10/day', pro: '100/day', premium: 'Unlimited' },
                { feature: 'File Uploads', free: '5 files', pro: '50 files', premium: 'Unlimited' },
                { feature: 'Storage', free: '500 MB', pro: '10 GB', premium: '100 GB' },
                { feature: 'Programming Academy', free: 'Basic courses', pro: 'All courses', premium: 'All + Early access' },
                { feature: 'Material Formats', free: 'TXT only', pro: 'PDF, DOCX, TXT', premium: 'All formats' },
                { feature: 'Export Options', free: '—', pro: 'PDF, MP4', premium: 'All formats' },
                { feature: 'Priority Support', free: '—', pro: 'Email', premium: '24/7 Chat' },
                { feature: 'API Access', free: '—', pro: '—', premium: 'Full REST API' },
                { feature: 'Team Collaboration', free: '—', pro: '—', premium: 'Up to 10 members' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-3.5 text-sm text-slate-300 font-medium">{row.feature}</td>
                  <td className="text-center px-4 py-3.5 text-sm text-slate-400">{row.free === '—' ? <span className="text-slate-600">—</span> : row.free}</td>
                  <td className="text-center px-4 py-3.5 text-sm text-slate-300 bg-indigo-500/5">{row.pro === '—' ? <span className="text-slate-600">—</span> : row.pro}</td>
                  <td className="text-center px-4 py-3.5 text-sm text-slate-300">{row.premium === '—' ? <span className="text-slate-600">—</span> : row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 text-center">Loved by learners worldwide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[#1E293B] border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{t.avatar}</span>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-slate-700/30">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors"
              >
                <span className="text-sm font-medium text-white text-left">{faq.q}</span>
                <ArrowRight className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${expandedFaq === i ? 'rotate-90' : ''}`} />
              </button>
              {expandedFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Money-back Guarantee */}
      <div className="text-center p-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl">
        <Shield className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">30-Day Money-Back Guarantee</h3>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Not satisfied? Get a full refund within 30 days, no questions asked. We're confident you'll love LearnAI Studio.
        </p>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            {paymentStep === 'form' && (
              <>
                <div className="p-6 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Complete Your Upgrade</h3>
                    <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white text-xl">&times;</button>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">
                    Upgrading to <span className="text-indigo-400 font-semibold">{selectedPlanData?.name}</span> — 
                    <span className="text-white font-semibold">${billingCycle === 'monthly' ? selectedPlanData?.price.toFixed(2) : selectedPlanData?.yearlyPrice.toFixed(2)}/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>
                  {/* Expiry & CVC */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1.5">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        maxLength={3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>
                  {/* Name */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm text-slate-400 mb-1.5">Email for Receipt</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  {/* Mobile Pay Options */}
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 text-sm hover:bg-slate-700/50 transition-colors">
                      <Smartphone className="w-4 h-4" />
                      Apple Pay
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 text-sm hover:bg-slate-700/50 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/></svg>
                      PayPal
                    </button>
                  </div>
                  <button
                    onClick={handlePayment}
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20 mt-2"
                  >
                    Pay ${billingCycle === 'monthly' ? selectedPlanData?.price.toFixed(2) : selectedPlanData?.yearlyPrice.toFixed(2)} / {billingCycle === 'monthly' ? 'month' : 'year'}
                  </button>
                  <p className="text-xs text-slate-500 text-center flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3" />
                    Secured by 256-bit SSL encryption. Cancel anytime.
                  </p>
                </div>
              </>
            )}
            {paymentStep === 'processing' && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-6" />
                <h3 className="text-lg font-bold text-white mb-2">Processing Payment...</h3>
                <p className="text-sm text-slate-400">Please wait while we activate your plan.</p>
              </div>
            )}
            {paymentStep === 'success' && (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Welcome to {selectedPlanData?.name}! 🎉</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Your account has been upgraded. Enjoy unlimited learning!
                </p>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
                >
                  Start Learning Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
