'use client';
import {useEffect, useState, useContext, createContext} from 'react';
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
  getAdditionalUserInfo,
} from '@firebase/auth';
import type {User, UserCredential} from '@firebase/auth';
import {collection, doc, setDoc} from '@firebase/firestore';

import type {AuthMethods} from './types';
import {auth, firestore} from '@/components/firebase';

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

export default function AuthProvider({defaultUser, children}: {defaultUser: User | null; children: React.ReactNode}) {
  const [currentUser, setCurrentUser] = useState<User | null>(defaultUser);

  async function setTokens(credential: UserCredential) {
    const tokenResult = await credential?.user.getIdTokenResult();
    // Sets authentication cookies
    await fetch('/api/login', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenResult.token}`,
      },
    });
    setCurrentUser(credential.user);
  }

  async function googleSignIn() {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    const credential = await signInWithPopup(auth, provider);
    await setTokens(credential);

    if (getAdditionalUserInfo(credential)?.isNewUser && credential.user.email) {
      const usersRef = collection(firestore, 'users');
      await setDoc(doc(usersRef, credential.user.email), {
        name: credential.user.displayName,
        profilePic: credential.user.photoURL,
      });
    }
    return credential;
  }

  async function signup(email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await setTokens(credential);

    const usersRef = collection(firestore, 'users');
    if (credential.user.email) {
      await setDoc(doc(usersRef, credential.user.email), {
        name: credential.user.displayName,
        profilePic: credential.user.photoURL,
      });
    }

    return credential;
  }

  async function login(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await setTokens(credential);
    return credential;
  }

  async function logout() {
    await signOut(auth);
    await fetch('/api/logout', {
      method: 'GET',
    });
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  async function anonSignup() {
    const credential = await signInAnonymously(auth);
    await setTokens(credential);
    return credential;
  }

  function updateUserPassword(password: string) {
    if (!currentUser) return Promise.resolve();
    return updatePassword(currentUser, password);
  }

  function updateUsername(username: string) {
    if (!currentUser) return Promise.resolve();
    return updateProfile(currentUser, {displayName: username});
  }

  function updateProfilePic(profilePic: string) {
    if (!currentUser) return Promise.resolve();
    return updateProfile(currentUser, {photoURL: profilePic});
  }

  function deleteCurrentUser() {
    if (!currentUser) return Promise.resolve();
    return deleteUser(currentUser);
  }

  useEffect(() => {
    async function handleIdTokenChanged(user: User | null) {
      user ? setCurrentUser(user) : setCurrentUser(null);
    }
    async function registerChangeListener() {
      return onIdTokenChanged(auth, handleIdTokenChanged);
    }
    const unsubscribePromise = registerChangeListener();

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe());
    };
  }, [currentUser]);

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
