// import {getTokens} from 'next-firebase-auth-edge/lib/next/tokens';
// import {NextResponse} from 'next/server';
// import {mapTokensToUser} from '@/components/server-actions/getCurrentUser';
// import {kv} from '@vercel/kv';
// import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';
// import {serverConfig} from '@/firebase-config';

// // export const runtime = 'edge';
// const {getUser} = getFirebaseAuth(serverConfig.serviceAccount, serverConfig.apiKey);
// export async function GET(request: Request) {
//   const tokens = await getTokens(request.cookies, {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//     serviceAccount: {
//       projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//       privateKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
//       clientEmail: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_CLIENT_EMAIL!,
//     },
//     cookieName: 'AuthToken',
//     cookieSignatureKeys: ['secret1', 'secret2'],
//   });
//   if (tokens?.decodedToken.uid) {
//     const userExists = await kv.exists(tokens.decodedToken.name.replaceAll(' ', '_') ?? '');
//     // console.log(userExists, await kv.exists(tokens.decodedToken.name ?? ''))
//     if (userExists === 0) {
//       console.log('new user', tokens.decodedToken.name, userExists);
//       const firebaseUser = await getUser(tokens.decodedToken.uid ?? '');
//       kv.hset(firebaseUser.displayName?.replaceAll(' ', '_') ?? '', {
//         email: firebaseUser.email,
//         metadata: firebaseUser.metadata,
//         photoURL: firebaseUser.photoURL,
//       });
//     }
//   }
//   if (tokens?.decodedToken) {
//     console.log('wtf', JSON.stringify(mapTokensToUser(tokens?.decodedToken)));
//     return NextResponse.json(JSON.stringify(mapTokensToUser(tokens?.decodedToken)));
//   }
//   return NextResponse.json({error: 'No user found'}, {status: 401});
// }
