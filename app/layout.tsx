import './globals.css';
import type {Metadata} from 'next';
import {kv} from '@vercel/kv';
import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';

import Providers from '@/components/contexts/providers';
import {Toaster} from '@/components/ui/toaster';
import {useAuthStore} from '@/hooks/useAuthStore';
import {mapTokensToUser} from '@/components/server-actions/getCurrentUser';
import {serverConfig} from '@/firebase-config';
import getCurrentUser from '@/components/server-actions/getCurrentUser';

export const metadata: Metadata = {
  title: 'WeChess Website',
  description: 'Play chess with your friends',
  viewport: {width: 'device-width', initialScale: 1},
};

// export const runtime = 'edge';
const {getUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const tokens = await getCurrentUser();
  if (tokens?.uid) {
    useAuthStore.setState({currentUser: mapTokensToUser(tokens)});
    if(!tokens.name) return;
    const userExists = await kv.exists(tokens.name.replaceAll(' ', '_') ?? '');
    // console.log(userExists, await kv.exists(tokens.decodedToken.name ?? ''))
    if (userExists === 0) {
      // console.log('new user', tokens.name, userExists);
      const firebaseUser = await getUser(tokens.uid ?? '');
      if (firebaseUser.displayName) {
        kv.hset(firebaseUser.displayName?.replaceAll(' ', '_') ?? '', {
          email: firebaseUser.email,
          metadata: firebaseUser.metadata,
          photoURL: firebaseUser.photoURL,
        });
      }
    }
  }
  // const user = await data.json();
  // if (user)
  // catch (e) {
  //   console.error(e);
  // }
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body className='h-screen w-screen'>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
