import {NextResponse, NextRequest} from 'next/server';

import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';
import {refreshAuthCookies} from 'next-firebase-auth-edge/lib/next/middleware';
import {serverConfig, commonOptions} from '@/firebase-config';
import {getTokens} from 'next-firebase-auth-edge/lib/next/tokens';

export const runtime = 'edge';
const {updateUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);
export async function POST(request: NextRequest) {
  const token = await getTokens(request.cookies, commonOptions);
  if (!token) throw new Error('Cannot update custom claims of unauthenticated user');

  const photoURL = request.nextUrl.searchParams.get('imgURL');

  await updateUser(token.decodedToken.uid, {photoURL: photoURL});
  const response = new NextResponse(
    JSON.stringify({
      picture: photoURL,
    }),
    {
      status: 200,
      headers: {'content-type': 'application/json'},
    }
  );
  await refreshAuthCookies(token.token, response, commonOptions);
  return response;
}
