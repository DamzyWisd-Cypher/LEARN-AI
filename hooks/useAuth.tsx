import React, { createContext, useContext, useState, useCallback } from 'react';

interface UserData {
  name: string;
  email: string;
  avatar?: string;
  provider: 'email' | 'google' | 'github';
  providerId?: string;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((userData: UserData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Clear any stored tokens
    localStorage.removeItem('learnai_token');
    localStorage.removeItem('learnai_user');
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    
    // In a real app, this would redirect to Google OAuth
    // For demo purposes, we'll simulate the OAuth flow
    
    // Step 1: In production, redirect to OAuth provider
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: {
    //     redirectTo: window.location.origin,
    //   }
    // })
    
    // Simulate OAuth popup/redirect
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // On success, set the user with Google provider info
    // In production, this data would come from the OAuth provider
    const googleUser: UserData = {
      name: 'Google User',
      email: 'user@gmail.com',
      provider: 'google',
      providerId: 'google_' + Math.random().toString(36).substr(2, 9),
    };
    
    setUser(googleUser);
    
    // Store token (demo only - in production use proper JWT)
    localStorage.setItem('learnai_token', 'google_demo_token');
    localStorage.setItem('learnai_user', JSON.stringify(googleUser));
    
    setIsLoading(false);
  }, []);

  const loginWithGithub = useCallback(async () => {
    setIsLoading(true);
    
    // In a real app, this would redirect to GitHub OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const githubUser: UserData = {
      name: 'GitHub User',
      email: 'user@github.com',
      provider: 'github',
      providerId: 'github_' + Math.random().toString(36).substr(2, 9),
    };
    
    setUser(githubUser);
    localStorage.setItem('learnai_token', 'github_demo_token');
    localStorage.setItem('learnai_user', JSON.stringify(githubUser));
    
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        loginWithGoogle,
        loginWithGithub,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// OAuth configuration - replace with your actual credentials
export const oauthConfig = {
  // Google OAuth - Get these from Google Cloud Console
  google: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile',
  },
  // GitHub OAuth - Get these from GitHub Developer Settings
  github: {
    clientId: 'YOUR_GITHUB_CLIENT_ID',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'read:user user:email',
  },
};

// Helper to generate OAuth URL
export function getOAuthUrl(provider: 'google' | 'github'): string {
  const config = oauthConfig[provider];
  
  if (provider === 'google') {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope,
      access_type: 'offline',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }
  
  if (provider === 'github') {
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      state: Math.random().toString(36).substring(2),
    });
    return `https://github.com/login/oauth/authorize?${params}`;
  }
  
  return '#';
}