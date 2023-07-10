import type {User as FirebaseUser} from '@firebase/auth';
export interface AuthMethods {
  currentUser: FirebaseUser | null;
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
