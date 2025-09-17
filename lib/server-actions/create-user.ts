'use server';

import {Tokens, getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';
import {refreshAuthCookies} from 'next-firebase-auth-edge/lib/next/middleware';

import {serverConfig, commonOptions} from '@/firebase-config';
import {NextResponse} from 'next/server';


const {getUser, updateUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);
export default async function createUser(token: Tokens) {
  const decodedToken = token.decodedToken;
  if (!decodedToken.uid) return;

  // new users do this:
  const firebaseUser = await getUser(decodedToken.uid ?? '');
  if (!firebaseUser || !firebaseUser.uid) return;

  const defaultProfilePic = '/default-profile-pic.svg';

  if (!firebaseUser.displayName || !firebaseUser.photoURL) {
    await updateUser(decodedToken.uid, {
      displayName: firebaseUser.displayName ?? decodedToken.uid,
      photoURL: firebaseUser.photoURL ?? defaultProfilePic,
    });
    const response = new NextResponse(
      JSON.stringify({
        name: firebaseUser.displayName ?? decodedToken.uid,
        picture: firebaseUser.photoURL ?? defaultProfilePic,
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
