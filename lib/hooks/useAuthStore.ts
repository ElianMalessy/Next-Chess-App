import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
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
  signInWithRedirect,
  getAdditionalUserInfo,
  linkWithCredential,
} from '@firebase/auth';
import type {AuthCredential, User, UserCredential} from '@firebase/auth';
import {auth, firestore} from '@/components/firebase';
import {collection, doc, setDoc, deleteDoc, query, where, getDocs} from '@firebase/firestore';
import {error} from 'console';
import {getBaseUrl} from '@/lib/get-base-url';

export interface AuthState {
  currentUser?: User;
  upgradeUserFromAnonymous: (currentUser: User, credential: AuthCredential) => void;
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
  upgradeUserFromAnonymous: (currentUser: User, credential: AuthCredential) => {
    console.log('', '\n\n\n\n\n currentUser: ', currentUser, '\n credential: ', credential, '\n\n\n\n');
    linkWithCredential(currentUser, credential)
      .then((usercred) => {
        console.log('Anonymous account successfully upgraded', usercred.user);
        // get().setTokens(usercred);
      })
      .catch((error) => {
        console.log('Error upgrading anonymous account', error);
      });
  },
  setCurrentUser: (user: User) => {
    set((state: AuthState) => ({
      ...state,
      currentUser: user,
    }));
  },
  setTokens: async (credential: UserCredential) => {
    const tokenResult = await credential?.user.getIdTokenResult();
    // Sets authentication cookies
    await fetch(getBaseUrl() + '/api/login', {
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
    // Always set displayName to use underscores
    const safeDisplayName = (credential.user.displayName || '').replace(/\s+/g, '_');
    if (credential.user.displayName !== safeDisplayName) {
      await updateProfile(credential.user, { displayName: safeDisplayName });
    }
    await get().setTokens(credential);

    // Update Firestore user doc using UID
    const usersRef = collection(firestore, 'users');
    await setDoc(doc(usersRef, credential.user.uid), {
      name: safeDisplayName,
      email: credential.user.email,
      profilePic: credential.user.photoURL,
    }, { merge: true });
    
    return credential;
  },

  signup: async (email: string, password: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    // Set displayName to email username (before @), replacing spaces with underscores
    const emailName = email.split('@')[0].replace(/\s+/g, '_');
    await updateProfile(credential.user, { displayName: emailName });
    await get().setTokens(credential);

    // Create Firestore user doc using UID
    const usersRef = collection(firestore, 'users');
    await setDoc(doc(usersRef, credential.user.uid), {
      name: emailName,
      email: credential.user.email,
      profilePic: credential.user.photoURL,
    }, { merge: true });

    return credential;
  },

  login: async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    // console.log(credential);
    await get().setTokens(credential);
    return credential;
  },

  logout: async () => {
    await signOut(auth);
    await fetch(getBaseUrl() + '/api/logout', {
      method: 'GET',
    });
  },
  resetPassword: async (email: string) => {
    return sendPasswordResetEmail(auth, email);
  },
  anonSignup: async () => {
    const credential = await signInAnonymously(auth);
    const anonName = `anon_${credential.user.uid.slice(0, 5)}`;
    const defaultProfilePic = '/default-profile-pic.svg';
    await updateProfile(credential.user, {
      displayName: anonName,
      photoURL: defaultProfilePic,
    });
    await get().setTokens(credential);

    // Create Firestore user doc for anonymous user using UID
    const usersRef = collection(firestore, 'users');
    await setDoc(doc(usersRef, credential.user.uid), {
      name: anonName,
      email: null, // Anonymous users don't have emails
      profilePic: defaultProfilePic,
      isAnonymous: true,
    }, { merge: true });

    setTimeout(() => {
      get().setCurrentUser({
        ...credential.user,
        displayName: anonName,
        photoURL: defaultProfilePic,
      });
    }, 0);
    return credential;
  },

  updateUserPassword: (password: string) => {
    if (!get().currentUser) return Promise.resolve();
    return updatePassword(get().currentUser, password);
  },

  updateUsername: async (username: string) => {
    if (!get().currentUser) return Promise.resolve();
    const safeDisplayName = username.replace(/\s+/g, '_');
    try {
      await updateProfile(get().currentUser, {displayName: safeDisplayName});
      // Update Firestore user doc using UID
      const usersRef = collection(firestore, 'users');
      await setDoc(doc(usersRef, get().currentUser.uid), {
        name: safeDisplayName,
      }, { merge: true });
      
      // Refresh user state
      set((state: AuthState) => ({
        ...state,
        currentUser: {
          ...state.currentUser!,
          displayName: safeDisplayName,
        },
      }));
    } catch (err: any) {
      // If error is auth/requires-recent-login, log out
      if (err.code === 'auth/requires-recent-login') {
        await get().logout();
      }
      throw err;
    }
  },

  updateProfilePic: async (profilePic: string) => {
    if (!get().currentUser) return Promise.resolve();
    await updateProfile(get().currentUser, {photoURL: profilePic});
    // Update Firestore user doc using UID
    const usersRef = collection(firestore, 'users');
    await setDoc(doc(usersRef, get().currentUser.uid), {
      profilePic: profilePic,
    }, { merge: true });
    
    // Refresh user state
    set((state: AuthState) => ({
      ...state,
      currentUser: {
        ...state.currentUser!,
        photoURL: profilePic,
      },
    }));
  },
  deleteCurrentUser: async () => {
    const currentUser = get().currentUser;
    if (!currentUser) return Promise.resolve();
    
    try {
      // Delete user's Firestore document using UID
      const usersRef = collection(firestore, 'users');
      await deleteDoc(doc(usersRef, currentUser.uid));
      
      // Delete user's completed games
      const gamesRef = collection(firestore, 'completedGames');
      const gamesQuery = query(gamesRef, where('participants', 'array-contains', currentUser.uid));
      const gamesSnapshot = await getDocs(gamesQuery);
      
      const gameDeletePromises = gamesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(gameDeletePromises);
      
      // Note: Conversations are not deleted as they involve other users
      // Consider anonymizing messages instead of deleting them
      
      // Delete Firebase Auth user
      await deleteUser(currentUser);
      
      // Clear user state
      set((state: AuthState) => ({
        ...state,
        currentUser: undefined,
      }));
    } catch (err: any) {
      // If error is auth/requires-recent-login, log out
      if (err.code === 'auth/requires-recent-login') {
        await get().logout();
      }
      throw err;
    }
  },
});
export const useAuthStore = create<AuthState>()(authStore);
