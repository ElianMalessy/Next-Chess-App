import './globals.css';
import type {Metadata} from 'next';

import Providers from '@/components/contexts/providers';
import {Toaster} from '@/components/ui/toaster';
import {useAuthStore} from '@/hooks/useAuthStore';
import {getTokens} from 'next-firebase-auth-edge/lib/next/tokens';
import {NextResponse} from 'next/server';
import {mapTokensToUser} from '@/components/server-actions/getCurrentUser';
import {kv} from '@vercel/kv';
import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';
import {serverConfig} from '@/firebase-config';
import {cookies} from 'next/headers';
export const metadata: Metadata = {
  title: 'WeChess Website',
  description: 'Play chess with your friends',
  viewport: {width: 'device-width', initialScale: 1},
};

// export const runtime = 'edge';
const {getUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const tokens = await getTokens(cookies(), {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL!,
    },
    cookieName: 'AuthToken',
    cookieSignatureKeys: ['secret1', 'secret2'],
  });
  if (tokens?.decodedToken.uid) {
    useAuthStore.setState({currentUser: mapTokensToUser(tokens?.decodedToken)});
    const userExists = await kv.exists(tokens.decodedToken.name.replaceAll(' ', '_') ?? '');
    // console.log(userExists, await kv.exists(tokens.decodedToken.name ?? ''))
    if (userExists === 0) {
      console.log('new user', tokens.decodedToken.name, userExists);
      const firebaseUser = await getUser(tokens.decodedToken.uid ?? '');
      kv.hset(firebaseUser.displayName?.replaceAll(' ', '_') ?? '', {
        email: firebaseUser.email,
        metadata: firebaseUser.metadata,
        photoURL: firebaseUser.photoURL,
      });
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
