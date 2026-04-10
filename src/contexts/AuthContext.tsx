import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

interface UserProfile {
  email: string;
  tier: 'free' | 'pro';
  createdAt: string;
  name?: string;
  image?: string;
  credits: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
