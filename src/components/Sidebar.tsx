import { 
  LayoutDashboard, 
  Gamepad2,
  MessageSquare, 
  Video, 
  Podcast, 
  Code, 
  Library,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Brain,
  ClipboardList,
  LogOut,
  CreditCard,
  Gem,
  Zap,
  Crown
} from 'lucide-react';
import { PlanType } from '../hooks/useSubscription';

type Section = 'dashboard' | 'chat' | 'videos' | 'podcasts' | 'academy' | 'library' | 'flashcards' | 'quizzes' | 'pricing' | 'billing' | 'games';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
  userName?: string;
  onLogout?: () => void;
  currentPlan?: PlanType;
}

const navItems = [
  { id: 'dashboard' as Section, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'games' as Section, label: 'Games Studio', icon: Gamepad2 },
  { id: 'chat' as Section, label: 'AI Tutor Chat', icon: MessageSquare },
  { id: 'videos' as Section, label: 'Video Generator', icon: Video },
  { id: 'podcasts' as Section, label: 'Podcast Studio', icon: Podcast },
  { id: 'flashcards' as Section, label: 'Flashcards', icon: Brain },
  { id: 'quizzes' as Section, label: 'Quiz Studio', icon: ClipboardList },
  { id: 'academy' as Section, label: 'Programming', icon: Code },
  { id: 'library' as Section, label: 'My Library', icon: Library },
];

const planLabels: Record<PlanType, string> = { free: 'Free', pro: 'Pro', premium: 'Premium' };
const planColors: Record<PlanType, string> = { free: 'text-slate-500', pro: 'text-indigo-400', premium: 'text-amber-400' };
const planBg: Record<PlanType, string> = { free: '', pro: 'bg-indigo-500/10', premium: 'bg-amber-500/10' };
const planBorder: Record<PlanType, string> = { free: '', pro: 'border-indigo-500/20', premium: 'border-amber-500/20' };

export default function Sidebar({ activeSection, onSectionChange, collapsed, onToggleCollapse, mobileOpen, onCloseMobile, userName = 'User', onLogout, currentPlan = 'free' }: SidebarProps) {
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const PlanIcon = currentPlan === 'premium' ? Crown : currentPlan === 'pro' ? Gem : Zap;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside 
        data-tour="sidebar"
        className={`fixed left-0 top-0 h-full bg-[#1E293B] border-r border-slate-700/50 flex flex-col transition-all duration-300 z-50
          ${collapsed ? 'md:w-16' : 'md:w-56'}
          w-56 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="px-3 py-3 border-b border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-sm bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                  LearnAI
                </h1>
                <p className="text-[10px] text-slate-400">Studio</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'group-hover:text-slate-300'}`} />
                {!collapsed && (
                  <span className="font-medium text-xs truncate">{item.label}</span>
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="border-t border-slate-700/50 my-2" />

          {/* Pricing */}
          <button
            onClick={() => { onSectionChange('pricing'); if (onCloseMobile) onCloseMobile(); }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 group ${
              activeSection === 'pricing'
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Gem className={`w-4 h-4 flex-shrink-0 ${activeSection === 'pricing' ? 'text-indigo-400' : 'group-hover:text-slate-300'}`} />
            {!collapsed && <span className="font-medium text-xs">Pricing</span>}
          </button>

          <button
            onClick={() => { onSectionChange('billing'); if (onCloseMobile) onCloseMobile(); }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 group ${
              activeSection === 'billing'
                ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <CreditCard className={`w-4 h-4 flex-shrink-0 ${activeSection === 'billing' ? 'text-indigo-400' : 'group-hover:text-slate-300'}`} />
            {!collapsed && <span className="font-medium text-xs">Billing</span>}
          </button>

          {/* Upgrade CTA for Free users */}
          {currentPlan === 'free' && !collapsed && (
            <div className="mt-2 p-2.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] font-semibold text-indigo-300">Unlock Everything</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-2">Unlimited AI features</p>
              <button
                onClick={() => { onSectionChange('pricing'); if (onCloseMobile) onCloseMobile(); }}
                className="w-full py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                Upgrade Now
              </button>
            </div>
          )}
        </nav>

        {/* User Profile & Sign Out */}
        <div className="px-2 py-2 border-t border-slate-700/50 space-y-1 flex-shrink-0">
          {!collapsed && (
            <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${planBg[currentPlan]} ${planBorder[currentPlan] ? `border ${planBorder[currentPlan]}` : ''}`}>
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-[10px] flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-200 truncate">{userName}</p>
                <div className="flex items-center gap-1">
                  <PlanIcon className={`w-2 h-2 ${planColors[currentPlan]}`} />
                  <p className={`text-[9px] ${planColors[currentPlan]}`}>{planLabels[currentPlan]}</p>
                </div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-[10px]">
                {initials}
              </div>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="font-medium text-xs">Sign Out</span>}
          </button>
          <button
            onClick={onToggleCollapse}
            className="w-full hidden md:flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all duration-150"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
