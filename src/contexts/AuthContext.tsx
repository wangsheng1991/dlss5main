import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { loadFirebase } from '../lib/firebase';
import { setAnalyticsAuthState } from '../lib/analytics';

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
    let authEvent = 0;

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

        authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
          const event = ++authEvent;
          setUser(currentUser);
          setAnalyticsAuthState(currentUser ? 'authenticated' : 'anonymous');
          // `loading` describes Firebase auth, not Firestore/profile bootstrap. The old code kept
          // this true while getDoc, getIdToken or /api/me/bootstrap ran, so one slow dependency
          // left `/download`'s request card as a skeleton forever even though Firebase had restored
          // the signed-in user. Release the gate as soon as auth has settled; hydrate the profile
          // independently and keep failures from becoming an unhandled async callback exception.
          setLoading(false);
          if (profileUnsubscribe) {
            profileUnsubscribe();
            profileUnsubscribe = null;
          }
          if (!currentUser) {
            setProfile(null);
            return;
          }

          setProfile(null);
          void (async () => {
            try {
              const userRef = doc(db, 'users', currentUser.uid);
              const userSnap = await getDoc(userRef);

              // Profile creation and signup credits are server-owned and idempotent.
              // Never grant or mutate credits from the browser.
              const idToken = await currentUser.getIdToken();
              const bootstrap = await fetch('/api/me/bootstrap', { method: 'POST', headers: { Authorization: `Bearer ${idToken}` } });
              if (!bootstrap.ok) throw new Error('Unable to initialize your account. Please try again.');
              const data = (await bootstrap.json()) as Partial<UserProfile>;
              if (cancelled || event !== authEvent) return;
              if (!userSnap.exists()) {
                // The server response is authoritative; snapshot listener will hydrate the full profile.
                setProfile({ email: currentUser.email || '', tier: data.tier || 'free', createdAt: new Date().toISOString(), name: currentUser.displayName || undefined, image: currentUser.photoURL || undefined, credits: data.credits ?? 0 });
              }

              // Listen for profile changes (e.g., credits deduction)
              profileUnsubscribe = onSnapshot(
                userRef,
                (docSnap) => {
                  if (docSnap.exists() && !cancelled && event === authEvent) {
                    setProfile(docSnap.data() as UserProfile);
                  }
                },
                (error) => console.error('Unable to read your account profile:', error),
              );
            } catch (error) {
              // Authentication is still valid when profile bootstrap fails. Keep the request form
              // usable and let account surfaces show their own empty/loading state instead of
              // trapping the whole site behind an indefinite auth skeleton.
              console.error('Unable to initialize account profile:', error);
            }
          })();
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
