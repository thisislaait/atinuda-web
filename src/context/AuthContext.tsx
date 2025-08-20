// 'use client';

// import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { auth, db } from '@/firebase/config';
// import { doc, getDoc } from 'firebase/firestore';

// interface ExtendedUser {
//   uid: string;
//   email: string | null;
//   firstName?: string;
//   lastName?: string;
//   company?: string;
// }

// interface AuthContextType {
//   user: ExtendedUser | null;
//   isAuthModalOpen: boolean;
//   openAuthModal: () => void;
//   closeAuthModal: () => void;
//   logout: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   isAuthModalOpen: false,
//   openAuthModal: () => {},
//   closeAuthModal: () => {},
//   logout: async () => {},
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<ExtendedUser | null>(null);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (firebaseUser) {
//         let extendedUser: ExtendedUser = {
//           uid: firebaseUser.uid,
//           email: firebaseUser.email,
//         };

//         try {
//           const userRef = doc(db, 'users', firebaseUser.uid);
//           const userSnap = await getDoc(userRef);

//           if (userSnap.exists()) {
//             const userData = userSnap.data();
//             extendedUser = {
//               ...extendedUser,
//               firstName: userData.firstName,
//               lastName: userData.lastName,
//               company: userData.company,
//             };
//           }
//         } catch (error) {
//           console.error('Error fetching Firestore user:', error);
//         }

//         setUser(extendedUser);
//       } else {
//         setUser(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isAuthModalOpen,
//         openAuthModal: () => setIsAuthModalOpen(true),
//         closeAuthModal: () => setIsAuthModalOpen(false),
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Optional convenience hook
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };


// 'use client';

// import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
// import { auth, db } from '@/firebase/config';
// import { onAuthStateChanged, signOut, User as FbUser } from 'firebase/auth';
// import { doc, getDoc, onSnapshot } from 'firebase/firestore';

// export type AppUser = {
//   uid: string;
//   email: string | null;
//   firstName?: string | null;
//   lastName?: string | null;
//   company?: string | null;

//   // APPOEMN / discount fields stored in Firestore
//   isAppoemnMember?: boolean;
//   appoemnValidated?: boolean;
//   appoemnRole?: 'exco' | 'member';
//   appoemnMemberId?: string | null;
//   discountCode?: string | null;     // e.g., "APPO50-123456" or "APPO20-123456"
//   discountUsed?: boolean;           // true = discount already consumed

//   // Allow any extra fields you store in /users
//   [key: string]: any;
// };

// type AuthContextType = {
//   user: AppUser | null;
//   loading: boolean;
//   isAuthModalOpen: boolean;
//   openAuthModal: () => void;
//   closeAuthModal: () => void;
//   logout: () => Promise<void>;
// };

// export const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   isAuthModalOpen: false,
//   openAuthModal: () => {},
//   closeAuthModal: () => {},
//   logout: async () => {},
// });

// function mergeFbAndDoc(fbUser: FbUser, data: any): AppUser {
//   return {
//     uid: fbUser.uid,
//     email: fbUser.email,
//     firstName: data?.firstName ?? fbUser.displayName?.split(' ')?.[0] ?? null,
//     lastName: data?.lastName ?? null,
//     company: data?.company ?? null,

//     isAppoemnMember: data?.isAppoemnMember ?? false,
//     appoemnValidated: data?.appoemnValidated ?? false,
//     appoemnRole: data?.appoemnRole ?? undefined,
//     appoemnMemberId: data?.appoemnMemberId ?? null,
//     discountCode: data?.discountCode ?? null,
//     discountUsed: data?.discountUsed ?? false,

//     ...data, // keep any other fields you store
//   };
// }

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<AppUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

//   const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
//   const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

//   useEffect(() => {
//     // Listen for Firebase Auth changes
//     const unsubAuth = onAuthStateChanged(auth, async (fb) => {
//       if (!fb) {
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       const userRef = doc(db, 'users', fb.uid);

//       // 1) Initial load
//       try {
//         const snap = await getDoc(userRef);
//         const data = snap.exists() ? snap.data() : {};
//         setUser(mergeFbAndDoc(fb, data));
//       } finally {
//         setLoading(false);
//       }

//       // 2) Live updates (discountUsed flip, role updates, etc.)
//       const unsubDoc = onSnapshot(userRef, (docSnap) => {
//         const data = docSnap.data() || {};
//         setUser((prev) => (prev ? mergeFbAndDoc(fb, { ...prev, ...data }) : mergeFbAndDoc(fb, data)));
//       });

//       // Cleanup Firestore listener when auth user changes/unmounts
//       return () => unsubDoc();
//     });

//     return () => unsubAuth();
//   }, []);

//   const logout = useCallback(async () => {
//     await signOut(auth);
//     setUser(null);
//   }, []);

//   const value = useMemo(
//     () => ({
//       user,
//       loading,
//       isAuthModalOpen,
//       openAuthModal,
//       closeAuthModal,
//       logout,
//     }),
//     [user, loading, isAuthModalOpen, openAuthModal, closeAuthModal, logout]
//   );

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

'use client';

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged, signOut, User as FbUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

export type AppUser = {
  uid: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;

  // APPOEMN / discount fields stored in Firestore
  isAppoemnMember?: boolean;
  appoemnValidated?: boolean;
  appoemnRole?: 'exco' | 'member';
  appoemnMemberId?: string | null;
  discountCode?: string | null;  
  discountUsed?: boolean;  

  // Allow any extra fields you store in /users
  [key: string]: unknown;
};

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthModalOpen: false,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  logout: async () => {},
});

// Strongly type the Firestore doc data as Partial<AppUser>
function mergeFbAndDoc(fbUser: FbUser, data?: Partial<AppUser>): AppUser {
  const d = data ?? {};
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    firstName: d.firstName ?? fbUser.displayName?.split(' ')?.[0] ?? null,
    lastName: d.lastName ?? null,
    company: d.company ?? null,

    isAppoemnMember: d.isAppoemnMember ?? false,
    appoemnValidated: d.appoemnValidated ?? false,
    appoemnRole: d.appoemnRole,
    appoemnMemberId: d.appoemnMemberId ?? null,
    discountCode: d.discountCode ?? null,
    discountUsed: d.discountUsed ?? false,

    ...d, // keep any other fields you store
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  useEffect(() => {
    // Listen for Firebase Auth changes
    const unsubAuth = onAuthStateChanged(auth, async (fb) => {
      if (!fb) {
        setUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const userRef = doc(db, 'users', fb.uid);

      // 1) Initial load
      try {
        const snap = await getDoc(userRef);
        const data: Partial<AppUser> = snap.exists() ? (snap.data() as Partial<AppUser>) : {};
        setUser(mergeFbAndDoc(fb, data));
      } finally {
        setLoading(false);
      }

      // 2) Live updates (discountUsed flip, role updates, etc.)
      const unsubDoc = onSnapshot(userRef, (docSnap) => {
        const data: Partial<AppUser> = (docSnap.data() as Partial<AppUser>) ?? {};
        setUser((prev) =>
          // merge latest Firestore data over previous user shape
          mergeFbAndDoc(fb, { ...(prev ?? {}), ...data })
        );
      });

      // Cleanup Firestore listener when auth user changes/unmounts
      return () => unsubDoc();
    });

    return () => unsubAuth();
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthModalOpen,
      openAuthModal,
      closeAuthModal,
      logout,
    }),
    [user, loading, isAuthModalOpen, openAuthModal, closeAuthModal, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
