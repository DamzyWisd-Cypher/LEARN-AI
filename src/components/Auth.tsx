import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  Code, 
  Video, 
  Radio, 
  Mail, 
  Lock, 
  User, 
  AlertCircle,
  ArrowRight,
  Loader2,
  Globe,
  ChevronDown,
  Check,
  Search,
  X
} from 'lucide-react';

export interface UserData {
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'google' | 'github';
  providerId?: string;
  language: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'th', name: 'ภาษาไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
];

interface AuthProps {
  onLogin: (user: UserData) => void;
  onLoginWithGoogle?: () => Promise<void>;
  onLoginWithGithub?: () => Promise<void>;
  isOAuthLoading?: boolean;
}

// OAuth provider icons as components
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export default function Auth({ 
  onLogin, 
  onLoginWithGoogle, 
  onLoginWithGithub, 
  isOAuthLoading 
}: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');

  // OAuth language picker state
  const [showOAuthLanguagePicker, setShowOAuthLanguagePicker] = useState(false);
  const [oAuthPendingUser, setOAuthPendingUser] = useState<UserData | null>(null);
  
  // Sign-up completion state (after OAuth)
  const [showSignUpCompletion, setShowSignUpCompletion] = useState(false);
  const [signUpName, setSignUpName] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 15;
    if (/\d/.test(pwd)) score += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 20;
    
    if (score < 30) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score < 60) return { score, label: 'Fair', color: 'bg-orange-500' };
    if (score < 80) return { score, label: 'Good', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword;

  // Features list for the promotional sidebar
  const features = [
    { icon: Brain, title: 'AI Tutor Chat', desc: 'Context-aware learning and study assistance' },
    { icon: Video, title: 'AI Video Lessons', desc: 'Instantly generate video tutorials from texts' },
    { icon: Radio, title: 'Study Podcasts', desc: 'Turn reading materials into engaging audio shows' },
    { icon: Code, title: 'Coding Academy', desc: 'Learn 50+ programming languages hands-on' },
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isLogin) {
      // Sign up validation
      if (!name) {
        setError('Please enter your name.');
        return;
      }
      if (!agreedToTerms) {
        setError('Please agree to the Terms of Service.');
        return;
      }
      if (!passwordsMatch) {
        setError('Passwords do not match.');
        return;
      }
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate authentication
    setTimeout(() => {
      setLoading(false);
      onLogin({ 
        name: name || email.split('@')[0], 
        email,
        provider: 'email',
        language: isLogin ? 'en' : selectedLanguage // Return users get English, new sign-ups get their selected language
      });
    }, 1200);
  };

  const handleGoogleLogin = async () => {
    if (onLoginWithGoogle) {
      try {
        setLoading(true);
        // Simulate Google OAuth and get user data
        const googleUser: UserData = {
          name: 'Google User',
          email: 'user@gmail.com',
          provider: 'google',
          providerId: 'google_' + Math.random().toString(36).substr(2, 9),
          language: selectedLanguage,
        };

        if (isLogin) {
          // Sign-in: directly login without showing language picker
          onLogin({ ...googleUser, language: 'en' });
        } else {
          // Sign-up: show language picker and sign-up completion
          setOAuthPendingUser(googleUser);
          setShowOAuthLanguagePicker(true);
        }
      } catch (err) {
        setError('Google sign-in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGithubLogin = async () => {
    if (onLoginWithGithub) {
      try {
        setLoading(true);
        // Simulate GitHub OAuth and get user data
        const githubUser: UserData = {
          name: 'GitHub User',
          email: 'user@github.com',
          provider: 'github',
          providerId: 'github_' + Math.random().toString(36).substr(2, 9),
          language: selectedLanguage,
        };

        if (isLogin) {
          // Sign-in: directly login without showing language picker
          onLogin({ ...githubUser, language: 'en' });
        } else {
          // Sign-up: show language picker and sign-up completion
          setOAuthPendingUser(githubUser);
          setShowOAuthLanguagePicker(true);
        }
      } catch (err) {
        setError('GitHub sign-in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmOAuthLanguage = () => {
    if (oAuthPendingUser) {
      // Move to sign-up completion step
      setSignUpName(oAuthPendingUser.name);
      setShowOAuthLanguagePicker(false);
      setShowSignUpCompletion(true);
    }
  };

  const completeSignUp = () => {
    if (oAuthPendingUser) {
      const finalName = signUpName.trim() || oAuthPendingUser.name;
      onLogin({ 
        ...oAuthPendingUser, 
        name: finalName,
        language: selectedLanguage 
      });
      setShowSignUpCompletion(false);
      setOAuthPendingUser(null);
      setSignUpName('');
    }
  };

  const skipSignUpCompletion = () => {
    if (oAuthPendingUser) {
      onLogin({ ...oAuthPendingUser, language: selectedLanguage });
      setShowSignUpCompletion(false);
      setOAuthPendingUser(null);
      setSignUpName('');
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ name: 'Guest User', email: 'guest@learnai.com', provider: 'email', language: 'en' });
    }, 800);
  };

  // Clear error when switching modes
  useEffect(() => {
    setError('');
  }, [isLogin]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-stretch">
      {/* Left side: Promotion/Branding Banner (hidden on mobile/small screens) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 border-r border-slate-800 p-8 xl:p-12 flex-col justify-between relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              LearnAI Studio
            </span>
          </div>

          <h1 className="text-2xl xl:text-4xl font-bold tracking-tight mb-4 leading-tight">
            Accelerate your mastery with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              AI-driven education
            </span>
          </h1>

          <p className="text-slate-400 text-sm lg:text-base mb-8 max-w-md">
            Upload your materials, generate flashcards, create educational podcasts, and learn programming languages seamlessly.
          </p>

          <div className="space-y-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700 text-indigo-400 mt-1">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats - hidden on small screens */}
        <div className="relative z-10 hidden xl:flex items-center gap-8 pt-8 border-t border-slate-800">
          <div>
            <div className="text-2xl font-bold text-white">50+</div>
            <div className="text-slate-400 text-sm">Languages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">10K+</div>
            <div className="text-slate-400 text-sm">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">4.9</div>
            <div className="text-slate-400 text-sm">Rating</div>
          </div>
        </div>
      </div>

      {/* Right side: Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-16 overflow-y-auto">
        <div className="w-full max-w-md py-4 sm:py-0">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8 lg:hidden">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold">LearnAI Studio</span>
          </div>

          {/* Header */}
          <div className="mb-5 sm:mb-7">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-slate-400">
              {isLogin 
                ? 'Enter your details to access your account' 
                : 'Start your learning journey with AI-powered education'}
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isOAuthLoading || loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-700 font-medium rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOAuthLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>
            
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={isOAuthLoading || loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOAuthLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <GithubIcon />
              )}
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-4 sm:my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0F172A] text-slate-500">or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3 sm:space-y-4">
            {/* Name field (Sign Up only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Language selector (Sign Up only) */}
            {!isLogin && (
              <div className="relative">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Preferred Language</label>
                <button
                  type="button"
                  onClick={() => { setLanguageDropdownOpen(!languageDropdownOpen); setLanguageSearch(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <Globe className="w-5 h-5 text-slate-500" />
                  <span className="text-lg">{SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.flag}</span>
                  <span className="flex-1 text-left">{SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Language dropdown */}
                {languageDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Search */}
                    <div className="p-2 border-b border-slate-700">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={languageSearch}
                          onChange={(e) => setLanguageSearch(e.target.value)}
                          placeholder="Search languages..."
                          autoFocus
                          className="w-full pl-9 pr-8 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {languageSearch && (
                          <button
                            onClick={() => setLanguageSearch('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Language list */}
                    <div className="max-h-52 overflow-y-auto">
                      {SUPPORTED_LANGUAGES
                        .filter(l => l.name.toLowerCase().includes(languageSearch.toLowerCase()) || l.code.includes(languageSearch.toLowerCase()))
                        .map((lang) => (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => { setSelectedLanguage(lang.code); setLanguageDropdownOpen(false); setLanguageSearch(''); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-700/50 transition-colors ${
                              selectedLanguage === lang.code ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-300'
                            }`}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="flex-1 text-left">{lang.name}</span>
                            {selectedLanguage === lang.code && <Check className="w-4 h-4 text-indigo-400" />}
                          </button>
                        ))}
                      {SUPPORTED_LANGUAGES.filter(l => l.name.toLowerCase().includes(languageSearch.toLowerCase())).length === 0 && (
                        <div className="px-4 py-6 text-center text-slate-500 text-sm">No languages found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              
              {/* Password strength indicator (Sign Up only) */}
              {!isLogin && password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                    <span className={`text-xs ${
                      passwordStrength.label === 'Weak' ? 'text-red-400' : 
                      passwordStrength.label === 'Fair' ? 'text-orange-400' :
                      passwordStrength.label === 'Good' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password field (Sign Up only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                      confirmPassword && !passwordsMatch 
                        ? 'bg-red-500/10 border-red-500' 
                        : 'bg-slate-800/50 border-slate-700'
                    }`}
                  />
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
                )}
              </div>
            )}

            {/* Terms checkbox (Sign Up only) */}
            {!isLogin && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                />
                <span className="text-sm text-slate-400">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>
                </span>
              </label>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || isOAuthLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Demo Login */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading || isOAuthLoading}
              className="w-full px-4 py-3 text-slate-400 font-medium rounded-xl hover:bg-slate-800/50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue as Guest (Demo)
            </button>
          </form>

          {/* Toggle between Sign In and Sign Up */}
          <p className="mt-8 text-center text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            {' '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-400 hover:underline font-medium"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

      {/* OAuth Language Picker Modal */}
      {showOAuthLanguagePicker && oAuthPendingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => { setShowOAuthLanguagePicker(false); setOAuthPendingUser(null); }}
          />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 md:p-8 animate-[scaleIn_0.3s_ease-out]">
            {/* Close button */}
            <button
              onClick={() => { setShowOAuthLanguagePicker(false); setOAuthPendingUser(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Choose Your Language</h3>
              <p className="text-slate-400 text-sm">
                Welcome, <span className="text-indigo-400 font-medium">{oAuthPendingUser.name}</span>! 
                Select your preferred language for the learning experience.
              </p>
            </div>

            {/* Language grid */}
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 max-h-60 sm:max-h-64 overflow-y-auto mb-4 sm:mb-6 pr-1">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`flex items-center gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    selectedLanguage === lang.code
                      ? 'bg-indigo-500/20 border-2 border-indigo-500 text-white'
                      : 'bg-slate-700/50 border-2 border-transparent text-slate-300 hover:bg-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="truncate">{lang.name}</span>
                  {selectedLanguage === lang.code && <Check className="w-4 h-4 text-indigo-400 ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>

            {/* Selected language display */}
            <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl mb-6">
              <span className="text-2xl">{SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.flag}</span>
              <div>
                <div className="text-sm text-slate-400">Selected</div>
                <div className="text-white font-medium">{SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}</div>
              </div>
            </div>

            {/* Confirm button */}
            <button
              type="button"
              onClick={confirmOAuthLanguage}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Continue in {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Skip option */}
            <button
              type="button"
              onClick={() => { setSelectedLanguage('en'); confirmOAuthLanguage(); }}
              className="w-full mt-2 px-4 py-2 text-slate-400 text-sm hover:text-white transition-colors"
            >
              Skip — use English
            </button>
          </div>
        </div>
      )}

      {/* Sign-up Completion Modal */}
      {showSignUpCompletion && oAuthPendingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={skipSignUpCompletion}
          />
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6 md:p-8 animate-[scaleIn_0.3s_ease-out]">
            {/* Close button */}
            <button
              onClick={skipSignUpCompletion}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-600 rounded-2xl mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Complete Your Profile</h3>
              <p className="text-slate-400 text-sm">
                You're almost there! Customize your profile to get started.
              </p>
            </div>

            {/* Provider badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                oAuthPendingUser.provider === 'google' 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' 
                  : 'bg-slate-700 text-slate-300 border border-slate-600'
              }`}>
                {oAuthPendingUser.provider === 'google' ? <GoogleIcon /> : <GithubIcon />}
                {oAuthPendingUser.provider === 'google' ? 'Google' : 'GitHub'} Account
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-sm">
                <span>{SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.flag}</span>
                {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name}
              </div>
            </div>

            {/* Name input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Your Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-slate-500 text-xs mt-2">This is how you'll appear in LearnAI Studio</p>
            </div>

            {/* Email display */}
            <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-xl mb-6">
              <Mail className="w-5 h-5 text-slate-500" />
              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div className="text-slate-300 text-sm">{oAuthPendingUser.email}</div>
              </div>
            </div>

            {/* Terms agreement */}
            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
              />
              <span className="text-sm text-slate-400">
                I agree to the{' '}
                <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>
              </span>
            </label>

            {/* Complete button */}
            <button
              type="button"
              onClick={completeSignUp}
              disabled={!agreedToTerms || !signUpName.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              Complete Sign Up
            </button>

            {/* Skip option */}
            <button
              type="button"
              onClick={skipSignUpCompletion}
              className="w-full mt-3 px-4 py-2 text-slate-400 text-sm hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}