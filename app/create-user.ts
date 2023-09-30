import {randomUUID} from 'crypto';

import {kv} from '@vercel/kv';
import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';
import {User, updateProfile} from '@firebase/auth';

import {serverConfig} from '@/firebase-config';
import {useAuthStore} from '@/hooks/useAuthStore';
import {mapTokensToUser} from '@/components/server-actions/getCurrentUser';
import getCurrentUser from '@/components/server-actions/getCurrentUser';

const {getUser, updateUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);
export default async function createUser() {
  const tokens = await getCurrentUser();
  if (!tokens?.uid) return;

  const idName = randomUUID();
  const userExists = await kv.exists(tokens.uid ?? '');
  if (userExists !== 0) return;

  // new users do this:
  const firebaseUser = await getUser(tokens.uid ?? '');
  if (firebaseUser.uid) {
    await kv.hset(tokens.uid ?? '', {
      // email: firebaseUser.email, anon users dont have this btw
      metadata: firebaseUser.metadata,
      photoURL:
        firebaseUser.photoURL ||
        'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a',
    });
  }
  const currentUserValue = mapTokensToUser(tokens);
  if (firebaseUser.displayName) {
    console.log(firebaseUser.displayName, 'nameeeeeeeeeeeeeeeeeeeeeee');
    useAuthStore.setState({currentUser: currentUserValue});
    kv.set(firebaseUser.displayName, tokens.uid);
  } else {
    updateUser(tokens.uid, {displayName: idName});
    console.log(idName, 'hereeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    useAuthStore.setState({currentUser: {...currentUserValue, displayName: idName}});
    kv.set(idName, tokens.uid);
  }
}
