import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  db,
  googleProvider,
  BOOTSTRAP_ADMIN_EMAIL,
  OperationType,
  handleFirestoreError,
  FirebaseUser,
} from '../firebase';
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'user';

export interface AppUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: AppUserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  allUsers: AppUserProfile[];
  usersLoading: boolean;
  loginWithGoogle: () => Promise<AppUserProfile | null>;
  loginWithEmail: (email: string, pass: string) => Promise<AppUserProfile | null>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<AppUserProfile | null>;
  logout: () => Promise<void>;
  updateUserRole: (targetUid: string, newRole: UserRole) => Promise<void>;
  deleteUser: (targetUid: string) => Promise<void>;
  addAdminByEmail: (email: string, role?: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<AppUserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);

  // Sync user profile when Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setLoading(true);
      if (fbUser) {
        setCurrentUser(fbUser);
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);

          const isBootstrapAdmin =
            fbUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

          if (snap.exists()) {
            const data = snap.data() as AppUserProfile;
            // Always ensure bootstrap email gets super_admin
            if (isBootstrapAdmin && data.role !== 'super_admin') {
              await updateDoc(userDocRef, { role: 'super_admin', updatedAt: new Date().toISOString() });
              data.role = 'super_admin';
            }
            setUserProfile(data);
          } else {
            // First time registration / Google Sign-in profile creation
            const initialRole: UserRole = isBootstrapAdmin ? 'super_admin' : 'user';
            const newProfile: AppUserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              photoURL: fbUser.photoURL || '',
              role: initialRole,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, newProfile);
            if (initialRole === 'super_admin') {
              await setDoc(doc(db, 'admins', fbUser.uid), {
                email: fbUser.email || '',
                role: initialRole,
                addedAt: new Date().toISOString(),
              });
            }
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error('Error fetching or creating user profile in Firestore:', err);
          // Fallback profile if offline
          setUserProfile({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'User',
            photoURL: fbUser.photoURL || '',
            role: fbUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase() ? 'super_admin' : 'user',
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Compute elevated permission states
  const isAdmin =
    userProfile?.role === 'super_admin' ||
    userProfile?.role === 'admin' ||
    currentUser?.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

  const isEditor = isAdmin || userProfile?.role === 'editor';

  // Listen to all users in real-time when an Admin is authenticated
  useEffect(() => {
    if (!isAdmin) {
      setAllUsers([]);
      return;
    }

    setUsersLoading(true);
    const usersCollection = collection(db, 'users');

    const unsubscribe = onSnapshot(
      usersCollection,
      (snapshot) => {
        const list: AppUserProfile[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as AppUserProfile;
          list.push({ ...item, uid: docSnap.id });
        });
        setAllUsers(list);
        setUsersLoading(false);
      },
      (error) => {
        setUsersLoading(false);
        try {
          handleFirestoreError(error, OperationType.GET, 'users');
        } catch (e) {
          console.warn('Firestore users collection snapshot handled:', e);
        }
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Google Sign-In with popup
  const loginWithGoogle = async (): Promise<AppUserProfile | null> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      const isBootstrapAdmin =
        fbUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

      const userDocRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userDocRef);

      let profile: AppUserProfile;
      if (snap.exists()) {
        profile = snap.data() as AppUserProfile;
        if (isBootstrapAdmin && profile.role !== 'super_admin') {
          profile.role = 'super_admin';
          await updateDoc(userDocRef, { role: 'super_admin', updatedAt: new Date().toISOString() });
        }
      } else {
        profile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          photoURL: fbUser.photoURL || '',
          role: isBootstrapAdmin ? 'super_admin' : 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, profile);
        if (isBootstrapAdmin) {
          await setDoc(doc(db, 'admins', fbUser.uid), {
            email: fbUser.email || '',
            role: 'super_admin',
            addedAt: new Date().toISOString(),
          });
        }
      }
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Google Sign In failed:', error);
      throw error;
    }
  };

  // Email & Password login
  const loginWithEmail = async (email: string, pass: string): Promise<AppUserProfile | null> => {
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = res.user;
      const snap = await getDoc(doc(db, 'users', fbUser.uid));
      if (snap.exists()) {
        const prof = snap.data() as AppUserProfile;
        setUserProfile(prof);
        return prof;
      }
      return null;
    } catch (error) {
      console.error('Email sign in failed:', error);
      throw error;
    }
  };

  // Sign up with Email & Password
  const signupWithEmail = async (email: string, pass: string, name: string): Promise<AppUserProfile | null> => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const fbUser = res.user;
      await updateProfile(fbUser, { displayName: name.trim() });

      const isBootstrapAdmin =
        fbUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

      const newProfile: AppUserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: name.trim() || fbUser.email?.split('@')[0] || 'User',
        photoURL: '',
        role: isBootstrapAdmin ? 'super_admin' : 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', fbUser.uid), newProfile);
      if (isBootstrapAdmin) {
        await setDoc(doc(db, 'admins', fbUser.uid), {
          email: fbUser.email || '',
          role: 'super_admin',
          addedAt: new Date().toISOString(),
        });
      }
      setUserProfile(newProfile);
      return newProfile;
    } catch (error) {
      console.error('Email signup failed:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    await fbSignOut(auth);
    setUserProfile(null);
    setCurrentUser(null);
  };

  // Change user role from Admin Panel
  const updateUserRole = async (targetUid: string, newRole: UserRole) => {
    try {
      const userRef = doc(db, 'users', targetUid);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });

      const adminRef = doc(db, 'admins', targetUid);
      if (newRole === 'super_admin' || newRole === 'admin') {
        const targetUser = allUsers.find((u) => u.uid === targetUid);
        await setDoc(adminRef, {
          email: targetUser?.email || '',
          role: newRole,
          addedAt: new Date().toISOString(),
        });
      } else {
        await deleteDoc(adminRef).catch(() => {});
      }

      setAllUsers((prev) =>
        prev.map((u) => (u.uid === targetUid ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  // Delete user record from Firestore
  const deleteUser = async (targetUid: string) => {
    try {
      await deleteDoc(doc(db, 'users', targetUid));
      await deleteDoc(doc(db, 'admins', targetUid)).catch(() => {});
      setAllUsers((prev) => prev.filter((u) => u.uid !== targetUid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${targetUid}`);
    }
  };

  // Add Admin by Email (for pre-authorizing administrators)
  const addAdminByEmail = async (email: string, role: UserRole = 'admin') => {
    const cleanEmail = email.trim().toLowerCase();
    // Search if user exists in allUsers
    const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      await updateUserRole(existing.uid, role);
    } else {
      // Create admin placeholder by clean email hash/id
      const pseudoId = `admin_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      await setDoc(doc(db, 'admins', pseudoId), {
        email: cleanEmail,
        role: role,
        addedAt: new Date().toISOString(),
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        isEditor,
        allUsers,
        usersLoading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        updateUserRole,
        deleteUser,
        addAdminByEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
