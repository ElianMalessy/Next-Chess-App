import {kv} from '@vercel/kv';
import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';

import {serverConfig} from '@/firebase-config';
import {useAuthStore} from '@/hooks/useAuthStore';
import {mapTokensToUser} from '@/components/server-actions/getCurrentUser';
import getCurrentUser from '@/components/server-actions/getCurrentUser';
const {getUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);

export const runtime = 'edge';
export default async function createUser() {
  const tokens = await getCurrentUser();
  if (!tokens?.uid) return;
  useAuthStore.setState({currentUser: mapTokensToUser(tokens)});
  const userExists = await kv.exists(tokens.uid ?? '');
  // console.log(userExists, await kv.exists(tokens.decodedToken.name ?? ''))
  if (userExists !== 0) return;
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
