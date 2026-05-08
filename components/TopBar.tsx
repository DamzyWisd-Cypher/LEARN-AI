import { Bell, LogOut, Gem, Zap, Crown, ChevronDown, Globe, Check, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { PlanType } from '../hooks/useSubscription';
import { SUPPORTED_LANGUAGES } from './Auth';

interface TopBarProps {
  onToggleMobileMenu?: () => void;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  currentPlan?: PlanType;
  onUpgradeClick?: () => void;
  userLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

const planConfig: Record<PlanType, { label: string; color: string; bg: string; icon: typeof Zap }> = {
  free: { label: 'Free', color: 'text-slate-400', bg: 'bg-slate-800/50', icon: Zap },
  pro: { label: 'Pro', color: 'text-indigo-400', bg: 'bg-indigo-500/10', icon: Gem },
  premium: { label: 'Premium', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Crown },
};

export default function TopBar({ 
  onToggleMobileMenu, 
  userName = 'User', 
  userEmail = '', 
  onLogout, 
  currentPlan = 'free', 
  onUpgradeClick,
  userLanguage = 'en',
  onLanguageChange,
}: TopBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [langSearch, setLangSearch] = useState('');

  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const firstName = userName.split(' ')[0];
  const plan = planConfig[currentPlan];
  const PlanIcon = plan.icon;
  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === userLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="h-12 sm:h-14 bg-[#1E293B]/90 backdrop-blur-lg border-b border-slate-700/50 flex items-center justify-between px-3 sm:px-4 sticky top-0 z-40 flex-shrink-0">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onToggleMobileMenu}
        className="md:hidden p-1.5 mr-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Page Title / Greeting */}
      <div className="flex-1 min-w-0 mr-2">
        <h2 className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
          Welcome back, <span className="text-indigo-400">{firstName}</span> 👋
        </h2>
        <p className="text-[10px] text-slate-500 hidden sm:block truncate">AI-powered learning</p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Upgrade button */}
        {currentPlan === 'free' && (
          <button
            onClick={onUpgradeClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            <Gem className="w-3 h-3" />
            Upgrade
          </button>
        )}

        {/* Plan badge */}
        <div className={`hidden lg:flex items-center gap-1 px-2 py-1 ${plan.bg} rounded-md`}>
          <PlanIcon className={`w-3 h-3 ${plan.color}`} />
          <span className={`text-[10px] font-semibold ${plan.color}`}>{plan.label}</span>
        </div>

        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => { setShowLangMenu(!showLangMenu); setLangSearch(''); }}
            className="flex items-center gap-1 px-2 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
            title={`Language: ${currentLang.name}`}
          >
            <span className="text-sm leading-none">{currentLang.flag}</span>
            <ChevronDown className={`w-2.5 h-2.5 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
          </button>

          {showLangMenu && (
            <>
              <div className="fixed inset-0 z-50" onClick={() => setShowLangMenu(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-2.5 border-b border-slate-700/50">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Select Language</p>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder="Search..."
                      autoFocus
                      className="w-full pl-8 pr-7 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {langSearch && (
                      <button onClick={() => setLangSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-52 overflow-y-auto p-1">
                  {SUPPORTED_LANGUAGES
                    .filter(l => l.name.toLowerCase().includes(langSearch.toLowerCase()) || l.code.includes(langSearch.toLowerCase()))
                    .map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { onLanguageChange?.(lang.code); setShowLangMenu(false); setLangSearch(''); }}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          userLanguage === lang.code ? 'bg-indigo-500/15 text-indigo-400' : 'text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="flex-1 text-left">{lang.name}</span>
                        {userLanguage === lang.code && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    ))}
                  {SUPPORTED_LANGUAGES.filter(l => l.name.toLowerCase().includes(langSearch.toLowerCase())).length === 0 && (
                    <div className="px-3 py-3 text-center text-slate-500 text-xs">No languages found</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-1.5 pl-2 border-l border-slate-700/50"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-200 leading-tight">{firstName}</p>
              <div className="flex items-center gap-0.5 justify-end">
                <PlanIcon className={`w-2.5 h-2.5 ${plan.color}`} />
                <p className={`text-[9px] ${plan.color}`}>{plan.label}</p>
              </div>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
              {initials}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-50" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-slate-700/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-200 truncate">{userName}</p>
                      <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
                    </div>
                  </div>
                  <div className={`mt-2 flex items-center gap-1 px-2 py-1 ${plan.bg} rounded-md w-fit`}>
                    <PlanIcon className={`w-2.5 h-2.5 ${plan.color}`} />
                    <span className={`text-[10px] font-semibold ${plan.color}`}>{plan.label} Plan</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5 px-2 py-1 bg-slate-700/30 rounded-md">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400">Lang:</span>
                    <span className="text-[10px] text-slate-200">{currentLang.flag} {currentLang.name}</span>
                  </div>
                </div>
                <div className="p-1.5">
                  {currentPlan === 'free' && (
                    <button
                      onClick={() => { setShowUserMenu(false); onUpgradeClick?.(); }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-700/50 rounded-lg transition-colors"
                    >
                      <Gem className="w-3.5 h-3.5 text-indigo-400" />
                      Upgrade Plan
                    </button>
                  )}
                  <button
                    onClick={() => { setShowUserMenu(false); onLogout?.(); }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
