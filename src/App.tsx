import { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Auth, { UserData } from './components/Auth';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import VideoGenerator from './components/VideoGenerator';
import PodcastStudio from './components/PodcastStudio';
import ProgrammingAcademy from './components/ProgrammingAcademy';
import Library from './components/Library';
import Flashcards from './components/Flashcards';
import QuizStudio from './components/QuizStudio';
import Pricing from './components/Pricing';
import Billing from './components/Billing';
import Onboarding from './components/Onboarding';
import StudyGames from './components/StudyGames';
import { SubscriptionProvider, useSubscription } from './hooks/useSubscription';

type FullSection = 'dashboard' | 'chat' | 'videos' | 'podcasts' | 'academy' | 'library' | 'flashcards' | 'quizzes' | 'pricing' | 'billing' | 'games';

// Simulated OAuth login functions (no longer used — Auth handles OAuth directly)
const simulateGoogleLogin = async (): Promise<UserData> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    name: 'Google User',
    email: 'user@gmail.com',
    provider: 'google',
    providerId: 'google_' + Math.random().toString(36).substr(2, 9),
    language: 'en',
  };
};

const simulateGithubLogin = async (): Promise<UserData> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    name: 'GitHub User',
    email: 'user@github.com',
    provider: 'github',
    providerId: 'github_' + Math.random().toString(36).substr(2, 9),
    language: 'en',
  };
};

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData>({ name: '', email: '', provider: 'email', language: 'en' });
  const [userLanguage, setUserLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState<FullSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { subscription } = useSubscription();

  // Determine initial state on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('learnai_user');
    const hasSeenOnboarding = localStorage.getItem('learnai_onboarding_seen');

    if (savedUser) {
      // Returning logged-in user — skip everything, go straight to app
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem('learnai_user');
      }
    } else if (hasSeenOnboarding === 'true') {
      // Returning user but not logged in — skip splash, show auth directly
    } else {
      // First-time visitor — show splash/loading screen
      setShowOnboarding(true);
    }
  }, []);

  const handleCompleteOnboarding = useCallback(() => {
    localStorage.setItem('learnai_onboarding_seen', 'true');
    setShowOnboarding(false);
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    setUserLanguage(userData.language || 'en');
    setIsLoggedIn(true);
    localStorage.setItem('learnai_user', JSON.stringify(userData));
  };

  const handleLanguageChange = (newLang: string) => {
    setUserLanguage(newLang);
    const updatedUser = { ...user, language: newLang };
    setUser(updatedUser);
    localStorage.setItem('learnai_user', JSON.stringify(updatedUser));
  };

  const handleGoogleLogin = useCallback(async () => {
    setIsOAuthLoading(true);
    try {
      const userData = await simulateGoogleLogin();
      handleLogin(userData);
    } catch (error) {
      console.error('Google login failed:', error);
    } finally {
      setIsOAuthLoading(false);
    }
  }, []);

  const handleGithubLogin = useCallback(async () => {
    setIsOAuthLoading(true);
    try {
      const userData = await simulateGithubLogin();
      handleLogin(userData);
    } catch (error) {
      console.error('GitHub login failed:', error);
    } finally {
      setIsOAuthLoading(false);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({ name: '', email: '', provider: 'email', language: 'en' });
    setUserLanguage('en');
    setActiveSection('dashboard');
    localStorage.removeItem('learnai_user');
  };

  const handleSectionChange = (section: FullSection) => {
    setActiveSection(section);
  };

  // Show onboarding splash only for first-time visitors
  if (showOnboarding) {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  // Show auth screen if not logged in
  if (!isLoggedIn) {
    return (
      <Auth 
        onLogin={handleLogin} 
        onLoginWithGoogle={handleGoogleLogin}
        onLoginWithGithub={handleGithubLogin}
        isOAuthLoading={isOAuthLoading}
      />
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={handleSectionChange} userName={user.name} />;
      case 'chat':
        return <AIChat />;
      case 'videos':
        return <VideoGenerator />;
      case 'podcasts':
        return <PodcastStudio />;
      case 'academy':
        return <ProgrammingAcademy />;
      case 'library':
        return <Library />;
      case 'flashcards':
        return <Flashcards />;
      case 'quizzes':
        return <QuizStudio />;
      case 'pricing':
        return <Pricing />;
      case 'billing':
        return <Billing />;
      case 'games':
        return <StudyGames />;
      default:
        return <Dashboard onNavigate={handleSectionChange} userName={user.name} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex overflow-hidden">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        userName={user.name}
        onLogout={handleLogout}
        currentPlan={subscription.plan}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
        } ml-0`}
      >
        <TopBar
          userName={user.name}
          userEmail={user.email}
          onLogout={handleLogout}
          currentPlan={subscription.plan}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          userLanguage={userLanguage}
          onLanguageChange={handleLanguageChange}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto overflow-x-hidden">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SubscriptionProvider>
      <AppContent />
    </SubscriptionProvider>
  );
}
