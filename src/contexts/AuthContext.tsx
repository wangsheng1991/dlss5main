import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

interface UserProfile {
  email: string;
  tier: 'free' | 'pro' | 'team';
  createdAt: string;
  name?: string;
  image?: string;
  credits: number;
  lastCheckIn?: string; // date string YYYY-MM-DD
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  dailyCheckIn: () => Promise<{ success: boolean; message: string; credits?: number; code?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let profileUnsubscribe: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user profile
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        // Profile creation and signup credits are server-owned and idempotent.
        // Never grant or mutate credits from the browser.
        const idToken = await currentUser.getIdToken();
        const bootstrap = await fetch('/api/me/bootstrap', { method: 'POST', headers: { Authorization: `Bearer ${idToken}` } });
        if (!bootstrap.ok) throw new Error('Unable to initialize your account. Please try again.');
        const data = (await bootstrap.json()) as Partial<UserProfile>;
        if (!userSnap.exists()) {
          // The server response is authoritative; snapshot listener will hydrate the full profile.
          setProfile({ email: currentUser.email || '', tier: data.tier || 'free', createdAt: new Date().toISOString(), name: currentUser.displayName || undefined, image: currentUser.photoURL || undefined, credits: data.credits ?? 0 });
        }

        // Listen for profile changes (e.g., credits deduction)
        import('firebase/firestore').then(({ onSnapshot }) => {
          profileUnsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
            }
          });
        });
      } else {
        setProfile(null);
        if (profileUnsubscribe) {
          profileUnsubscribe();
          profileUnsubscribe = null;
        }
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Credits are server-owned: the browser only asks for the daily allowance and reads the balance.
  const dailyCheckIn = async (): Promise<{ success: boolean; message: string; credits?: number; code?: string }> => {
    if (!user) return { success: false, message: 'Not logged in' };
    try {
      const response = await fetch('/api/me/checkin', { method: 'POST', headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) return { success: false, message: typeof data.error === 'string' ? data.error : 'Check-in failed. Try again later.', code: typeof data.code === 'string' ? data.code : undefined };
      return { success: true, message: `+${data.awarded ?? 5}`, credits: data.credits };
    } catch {
      return { success: false, message: 'Check-in failed. Check your connection.' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, logout, dailyCheckIn }}>
      {children}
    </AuthContext.Provider>
  );
};
