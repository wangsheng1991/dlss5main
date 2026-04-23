import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, increment } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

interface UserProfile {
  email: string;
  tier: 'free' | 'pro';
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
  deductCredit: (amount?: number) => Promise<number>;
  dailyCheckIn: () => Promise<{ success: boolean; message: string; credits?: number }>;
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
        
        if (!userSnap.exists()) {
          // Create new user profile
          const newProfile: UserProfile = {
            email: currentUser.email || '',
            tier: 'free',
            createdAt: new Date().toISOString(),
            name: currentUser.displayName || undefined,
            image: currentUser.photoURL || undefined,
            credits: 10,
          };
          await setDoc(userRef, newProfile);
          
          // Grant signup bonus
          const creditRef = doc(db, 'credits', `${currentUser.uid}_signup`);
          await setDoc(creditRef, {
            userId: currentUser.uid,
            transactionType: 'grant',
            credits: 10,
            remainingCredits: 10,
            status: 'active',
            createdAt: new Date().toISOString()
          });
        } else {
          // Handle existing users who might not have credits field
          const data = userSnap.data();
          if (data.credits === undefined) {
            await updateDoc(userRef, { credits: 10 });
          }
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

  const deductCredit = async (amount: number = 1): Promise<number> => {
    if (!user) return 0;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { credits: increment(-amount) });
    const updatedSnap = await getDoc(userRef);
    return (updatedSnap.data()?.credits ?? 0);
  };

  const dailyCheckIn = async (): Promise<{ success: boolean; message: string; credits?: number }> => {
    if (!user) return { success: false, message: 'Not logged in' };
    const userRef = doc(db, 'users', user.uid);
    const today = new Date().toISOString().split('T')[0];

    const snap = await getDoc(userRef);
    if (!snap.exists()) return { success: false, message: 'User not found' };

    const lastCheckIn = snap.data().lastCheckIn;
    if (lastCheckIn === today) {
      return { success: false, message: 'Already checked in today' };
    }

    await updateDoc(userRef, {
      credits: increment(5),
      lastCheckIn: today
    });

    const updatedSnap = await getDoc(userRef);
    return { success: true, message: 'Check-in successful! +5 credits', credits: updatedSnap.data()?.credits };
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, logout, deductCredit, dailyCheckIn }}>
      {children}
    </AuthContext.Provider>
  );
};
