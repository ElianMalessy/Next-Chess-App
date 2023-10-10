import type {ServiceAccount} from 'next-firebase-auth-edge/lib/auth/credential';
interface Config {
  apiKey: string;
  serviceAccount: ServiceAccount;
}
export const serverConfig: Config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  serviceAccount: {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL!,
  },
};

export const commonOptions = {
  apiKey: serverConfig.apiKey,
  cookieName: 'AuthToken',
  cookieSignatureKeys: ['secret1', 'secret2'],
  cookieSerializeOptions: {
    path: '/',
    httpOnly: true,
    secure: false, // Set this to true on HTTPS environments
    sameSite: 'strict' as const,
    maxAge: 12 * 60 * 60 * 24, // twelve days
  },
  serviceAccount: serverConfig.serviceAccount,
};
