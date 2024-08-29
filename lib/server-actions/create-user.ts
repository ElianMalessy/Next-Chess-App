'use server';

import {kv} from '@vercel/kv';
import {v4} from 'uuid';
import {Tokens, getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';
import {refreshAuthCookies} from 'next-firebase-auth-edge/lib/next/middleware';

import {serverConfig, commonOptions} from '@/firebase-config';
import {NextResponse} from 'next/server';


const {getUser, updateUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);
export default async function createUser(token: Tokens) {
  const decodedToken = token.decodedToken;
  if (!decodedToken.uid) return;
  const userExists = await kv.exists(decodedToken.uid ?? '');
  if (userExists !== 0) return;

  // new users do this:
  const firebaseUser = await getUser(decodedToken.uid ?? '');
  if (!firebaseUser || !firebaseUser.uid) return;

  const defaultProfilePic =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';

  if (firebaseUser.displayName) {
    await kv.hset(decodedToken.uid ?? '', {
      // email: firebaseUser.email, anon users dont have this
      metadata: firebaseUser.metadata,
      photoURL: firebaseUser.photoURL,
      scale: 1,
      startOffset: {x: 0, y: 0},
    });
    await kv.set(firebaseUser.displayName.replaceAll(' ', '_'), decodedToken.uid);
    await kv.lpush('users', {username: firebaseUser.displayName, uid: decodedToken.uid});
  } else {
    const idName = v4();
    await kv.hset(decodedToken.uid ?? '', {
      // email: firebaseUser.email, anon users dont have this
      metadata: firebaseUser.metadata,
      photoURL: defaultProfilePic,
      scale: 1,
      startOffset: {x: 0, y: 0},
    });
    await kv.set(idName, decodedToken.uid);
    await kv.lpush('users', {username: idName, uid: decodedToken.uid});

    await updateUser(decodedToken.uid, {displayName: idName, photoURL: defaultProfilePic});
    const response = new NextResponse(
      JSON.stringify({
        name: idName,
        picture: defaultProfilePic,
      }),
      {
        status: 200,
        headers: {'content-type': 'application/json'},
      }
    );
    await refreshAuthCookies(token.token, response, commonOptions);
    return response;
  }
}
