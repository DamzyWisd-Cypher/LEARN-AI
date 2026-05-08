import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [progress, setProgress] = useState(0);
  const [fadeText, setFadeText] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Cycle through loading texts
    const texts = [
      'Initializing AI Engine...',
      'Loading Learning Models...',
      'Preparing Your Workspace...',
      'Almost Ready...',
    ];
    let textIndex = 0;
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length;
      setFadeText(textIndex);
    }, 600);

    // Auto-complete after splash
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const loadingTexts = [
    'Initializing AI Engine...',
    'Loading Learning Models...',
    'Preparing Your Workspace...',
    'Almost Ready...',
  ];

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-[400px] h-48 sm:h-[400px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1400ms' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 animate-scaleIn">
        {/* Logo */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/30 animate-float">
          <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight animate-slideUp">
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            LearnAI
          </span>
          <span className="text-white"> Studio</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-10 animate-fadeIn" style={{ animationDelay: '300ms' }}>
          Your AI-Powered Learning Companion
        </p>

        {/* Progress Bar */}
        <div className="w-56 sm:w-72 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Text */}
        <div className="h-6 mt-4 sm:mt-5 animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <p
            key={fadeText}
            className="text-slate-500 text-xs sm:text-sm animate-fadeIn"
          >
            {loadingTexts[fadeText]}
          </p>
        </div>

        {/* Version */}
        <p className="text-slate-700 text-[10px] sm:text-xs mt-8 sm:mt-12 animate-fadeIn" style={{ animationDelay: '700ms' }}>
          v2.0 — AI-Powered Education Platform
        </p>
      </div>
    </div>
  );
}
