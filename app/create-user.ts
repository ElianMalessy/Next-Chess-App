import {randomUUID} from 'crypto';

import {kv} from '@vercel/kv';
import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';

import {serverConfig} from '@/firebase-config';
import {useAuthStore} from '@/hooks/useAuthStore';
import {mapTokensToUser} from '@/components/server-actions/getCurrentUser';
import {DecodedIdToken} from 'next-firebase-auth-edge/lib/auth/token-verifier';

const {getUser, updateUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);
export default async function createUser(decodedToken: DecodedIdToken) {
  if (!decodedToken.uid) return;
  const userExists = await kv.exists(decodedToken.uid ?? '');
  if (userExists !== 0) return;

  // new users do this:
  const firebaseUser = await getUser(decodedToken.uid ?? '');
  if (firebaseUser.uid) {
    await kv.hset(decodedToken.uid ?? '', {
      // email: firebaseUser.email, anon users dont have this btw
      metadata: firebaseUser.metadata,
      photoURL:
        firebaseUser.photoURL ||
        'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a',
    });
  }
  const currentUserValue = mapTokensToUser(decodedToken);
  if (firebaseUser.displayName) {
    useAuthStore.setState({currentUser: currentUserValue});
    kv.set(firebaseUser.displayName, decodedToken.uid);
  } else {
    const idName = randomUUID();
    updateUser(decodedToken.uid, {displayName: idName});
    useAuthStore.setState({currentUser: {...currentUserValue, displayName: idName}});
    kv.set(idName, decodedToken.uid);
  }
}
