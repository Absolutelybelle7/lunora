import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setSession({ user: userData, access_token: 'token' });
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign in - just check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (!foundUser) {
      return { error: { message: 'Invalid credentials' } };
    }

    const userObj: User = {
      id: foundUser.id,
      email: foundUser.email,
      user_metadata: { full_name: foundUser.full_name },
    };

    setUser(userObj);
    setSession({ user: userObj, access_token: 'token' });
    localStorage.setItem('auth_user', JSON.stringify(userObj));

    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find((u: any) => u.email === email)) {
      return { error: { message: 'User already exists' } };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password,
      full_name: fullName,
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const userObj: User = {
      id: newUser.id,
      email: newUser.email,
      user_metadata: { full_name: newUser.full_name },
    };

    setUser(userObj);
    setSession({ user: userObj, access_token: 'token' });
    localStorage.setItem('auth_user', JSON.stringify(userObj));

    return { error: null };
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
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
