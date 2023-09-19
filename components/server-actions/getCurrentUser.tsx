'use server';

import {cookies} from 'next/headers';
import {getTokens} from 'next-firebase-auth-edge/lib/next/tokens';
import {User} from '@firebase/auth';
import type {Tokens} from 'next-firebase-auth-edge/lib/auth';

const mapTokensToUser = ({decodedToken}: Tokens): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
  } = decodedToken;
  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
  } as User;
};

export default async function getCurrentUser() {
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
  if (!tokens) return null;
  return mapTokensToUser(tokens);
}
