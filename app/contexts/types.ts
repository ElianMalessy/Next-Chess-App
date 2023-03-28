export type CustomClaims = {[key: string]: any};
export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  customClaims: CustomClaims;
  idToken: string;
}

export interface AuthMethods {
  currentUser: User | null;
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
