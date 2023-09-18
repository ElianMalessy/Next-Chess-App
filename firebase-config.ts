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
