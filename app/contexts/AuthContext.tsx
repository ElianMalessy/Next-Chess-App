'use client';
import {useEffect, useState, useContext, createContext, startTransition, useRef} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onIdTokenChanged,
  signInAnonymously,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from '@firebase/auth';
import type {User as FirebaseUser, IdTokenResult} from '@firebase/auth';

import type {User, AuthMethods} from './types';
import {auth} from '../firebase';

const defaultValue: AuthMethods = {
  currentUser: null,
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  anonSignup: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  updateUserPassword: () => Promise.resolve(),
  deleteCurrentUser: () => Promise.resolve(),
  updateUsername: () => Promise.resolve(),
  updateProfilePic: () => Promise.resolve(),
  googleSignIn: () => Promise.resolve(),
};
const AuthContext = createContext<AuthMethods>(defaultValue);

export function useAuth() {
  return useContext(AuthContext);
}

function mapFirebaseResponseToUser(result: IdTokenResult, user: FirebaseUser): User {
  const providerData = user.providerData && user.providerData[0];

  if (!user.isAnonymous && providerData) {
    return {
      uid: user.uid,
      name: providerData.displayName || user.displayName || user.email || null,
      email: providerData.email || null,
      emailVerified: user.emailVerified || false,
      photoURL: providerData.photoURL || null,
      customClaims: {},
      isAnonymous: user.isAnonymous,
      idToken: result.token,
    };
  }

  return {
    uid: user.uid,
    name: user.displayName || providerData?.displayName || user.email || null,
    email: user.email || null,
    emailVerified: user.emailVerified || false,
    photoURL: user.photoURL || null,
    customClaims: {},
    isAnonymous: user.isAnonymous,
    idToken: result.token,
  };
}

export function AuthProvider({children}: any) {
  const [currentUser, setCurrentUser] = useState<any>();

  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  function signup(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  async function anonSignup() {
    await signInAnonymously(auth);
  }

  function updateUserPassword(password: string) {
    return updatePassword(currentUser, password);
  }

  function updateUsername(username: string) {
    return updateProfile(currentUser, {displayName: username});
  }

  function updateProfilePic(profilePic: string) {
    return updateProfile(currentUser, {photoURL: profilePic});
  }

  function deleteCurrentUser() {
    return deleteUser(currentUser);
  }

  async function handleIdTokenChanged(firebaseUser: FirebaseUser | null) {
    if (firebaseUser && currentUser && firebaseUser.uid === currentUser.uid) {
      return;
    }

    if (!firebaseUser) {
      startTransition(() => {
        setCurrentUser(null);
      });
      return;
    }

    const tokenResult = await firebaseUser.getIdTokenResult();
    // Sets authentication cookies
    await fetch('/api/login', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenResult.token}`,
      },
    });
    startTransition(() => {
      setCurrentUser(mapFirebaseResponseToUser(tokenResult, firebaseUser));
    });
  }

  async function registerChangeListener() {
    return onIdTokenChanged(auth, handleIdTokenChanged);
  }
  useEffect(() => {
    const unsubscribePromise = registerChangeListener();

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe());
    };
  }, []);

  const value: AuthMethods = {
    currentUser,
    login,
    signup,
    logout,
    anonSignup,
    resetPassword,
    updateUserPassword,
    deleteCurrentUser,
    updateUsername,
    updateProfilePic,
    googleSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
