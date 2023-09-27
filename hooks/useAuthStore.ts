import {create} from 'zustand';
import {devtools} from 'zustand/middleware';
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
import {auth, firestore} from '@/components/firebase';
import {collection, doc, setDoc} from '@firebase/firestore';

export interface AuthState {
  currentUser?: User;
  setCurrentUser: (user: User) => void;
  setTokens: (credential: UserCredential) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  anonSignup: () => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  deleteCurrentUser: () => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateProfilePic: (profilePic: string) => Promise<void>;
  googleSignIn: () => Promise<any>;
}
const authStore = (set: any, get: any) => ({
  setCurrentUser: (user: User) => {
    set((state: AuthState) => ({
      ...state,
      currentUser: user,
    }));
  },
  setTokens: async (credential: UserCredential) => {
    const tokenResult = await credential?.user.getIdTokenResult();
    // Sets authentication cookies
    await fetch('/api/login', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenResult.token}`,
      },
    });
    set((state: AuthState) => ({
      ...state,
      currentUser: credential.user,
    }));
  },

  googleSignIn: async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    const credential = await signInWithPopup(auth, provider);
    await get().setTokens(credential);

    if (getAdditionalUserInfo(credential)?.isNewUser && credential.user.email) {
      const usersRef = collection(firestore, 'users');
      await setDoc(doc(usersRef, credential.user.email), {
        name: credential.user.displayName,
        profilePic: credential.user.photoURL,
      });
    }
    return credential;
  },

  signup: async (email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await get().setTokens(credential);

    const usersRef = collection(firestore, 'users');
    if (credential.user.email) {
      await setDoc(doc(usersRef, credential.user.email), {
        name: credential.user.displayName,
        profilePic: credential.user.photoURL,
      });
    }

    return credential;
  },

  login: async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await get().setTokens(credential);
    return credential;
  },

  logout: async () => {
    await signOut(auth);
    await fetch('/api/logout', {
      method: 'GET',
    });
  },
  resetPassword: async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  },
  anonSignup: async () => {
    const credential = await signInAnonymously(auth);
    await get().setTokens(credential);
    return credential;
  },

  updateUserPassword: (password: string) => {
    if (!get().currentUser) return Promise.resolve();
    return updatePassword(get().currentUser, password);
  },

  updateUsername: (username: string) => {
    if (!get().currentUser) return Promise.resolve();
    return updateProfile(get().currentUser, {displayName: username});
  },

  updateProfilePic: (profilePic: string) => {
    if (!get().currentUser) return Promise.resolve();
    return updateProfile(get().currentUser, {photoURL: profilePic});
  },
  deleteCurrentUser: () => {
    if (!get().currentUser) return Promise.resolve();
    return deleteUser(get().currentUser);
  },
});
export const useAuthStore = create<AuthState>()(devtools(authStore));
