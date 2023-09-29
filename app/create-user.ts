import {randomUUID} from 'crypto';

import {kv} from '@vercel/kv';
import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';

import {serverConfig} from '@/firebase-config';
import {useAuthStore} from '@/hooks/useAuthStore';
import {mapTokensToUser} from '@/components/server-actions/getCurrentUser';
import getCurrentUser from '@/components/server-actions/getCurrentUser';
const {getUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);

export default async function createUser() {
  const tokens = await getCurrentUser();
  if (!tokens?.uid) return;

  const currentUserValue = mapTokensToUser(tokens);
  useAuthStore.setState({currentUser: currentUserValue});
  const userExists = await kv.exists(tokens.uid ?? '');
  if (userExists !== 0) return;

  // new users do this:
  if (tokens.name) {
    await kv.set(tokens.name, tokens.uid);
  } else {
    const idName = randomUUID();
    await kv.set(idName, tokens.uid);
    useAuthStore.setState({currentUser: {...currentUserValue, displayName: idName}});
  }
  const firebaseUser = await getUser(tokens.uid ?? '');
  if (firebaseUser.displayName) {
    kv.hset(firebaseUser.uid ?? '', {
      email: firebaseUser.email,
      metadata: firebaseUser.metadata,
      photoURL: firebaseUser.photoURL,
    });
  }
}
