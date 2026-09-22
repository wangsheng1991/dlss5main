import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { loadFirebase } from '../lib/firebase';

interface UserProfile {
  email: string;
  tier: 'free' | 'pro' | 'team';
  createdAt: string;
  name?: string;
  image?: string;
  credits: number;
  /** Promotional credits, spent after the monthly allowance and never cleared by the month rollover. */
  bonusCredits?: number;
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
    let authUnsubscribe: (() => void) | null = null;
    let cancelled = false;

    /**
     * The provider is always mounted, but the SDK behind it is not: visitors read the page first and
     * the browser fetches firebase once it has nothing better to do. Someone who signed in earlier
     * still gets their session back a moment after the first paint, and anything that needs auth
     * before then (the sign-in page) loads the same module on demand.
     */
    const start = () => {
      void (async () => {
        const { auth, db, onAuthStateChanged, doc, getDoc, onSnapshot } = await loadFirebase();
        if (cancelled) return;

        authUnsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
            profileUnsubscribe = onSnapshot(userRef, (docSnap) => {
              if (docSnap.exists()) {
                setProfile(docSnap.data() as UserProfile);
              }
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
      })().catch((error) => {
        console.error('Unable to start authentication:', error);
        if (!cancelled) setLoading(false);
      });
    };

    // Safari before 16.4 has no requestIdleCallback; a short delay is the same thing there.
    const hasIdleCallback = typeof window.requestIdleCallback === 'function';
    const handle = hasIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1000 })
      : window.setTimeout(start, 200);

    return () => {
      cancelled = true;
      if (hasIdleCallback) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      if (authUnsubscribe) authUnsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { auth, googleProvider, signInWithPopup } = await loadFirebase();
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { auth, signOut } = await loadFirebase();
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
