'use server';

import {kv} from '@vercel/kv';
import getCurrentUser, {mapTokensToUser} from '@/components/server-actions/getCurrentUser';
import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';
import {serverConfig} from '@/firebase-config';
import ThemeProvider from './theme-provider';
import AuthProvider from './auth-provider';

const {getUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);
export default async function Providers({children}: {children: React.ReactNode}) {
  const currentUser = await getCurrentUser();
  if (currentUser?.uid) {
    const userExists = await kv.exists(currentUser?.name ?? '');
    if (userExists === 0) {
      console.log('new user', currentUser.name);
      const firebaseUser = await getUser(currentUser?.uid ?? '');
      kv.hset(firebaseUser.displayName?.replaceAll(' ', '_') ?? '', {
        email: firebaseUser.email,
        metadata: firebaseUser.metadata,
        photoURL: firebaseUser.photoURL,
      });
    }
  }

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <AuthProvider defaultUser={currentUser ? mapTokensToUser(currentUser) : null}>{children}</AuthProvider>
    </ThemeProvider>
  );
}
