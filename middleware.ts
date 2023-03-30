import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {authentication} from 'next-firebase-auth-edge/lib/next/middleware';
import {serverConfig} from './config/server_config';

function redirectToLogin(request: NextRequest) {
  if (request.nextUrl.pathname !== '/update-profile') {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  url.search = `redirect=${request.nextUrl.pathname}`;
  return NextResponse.redirect(url);
}
function redirectToHome(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.search = `redirect=${request.nextUrl.pathname}`;
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  return authentication(request, {
    loginPath: '/api/login',
    logoutPath: '/api/logout',
    apiKey: serverConfig.firebaseApiKey,
    cookieName: 'AuthToken',
    cookieSignatureKeys: ['secret1', 'secret2'],
    cookieSerializeOptions: {
      path: '/',
      httpOnly: true,
      secure: false, // Set this to true on HTTPS environments
      sameSite: 'strict' as const,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
    },
    serviceAccount: serverConfig.serviceAccount,
    isTokenValid: (token) => token.email_verified ?? false,
    handleInvalidToken: async () => {
      return redirectToLogin(request);
    },
    handleValidToken: async () => {
      return redirectToHome(request);
    },
    handleError: async (error) => {
      console.error('Unhandled authentication error', {error});
      return redirectToLogin(request);
    },
  });
}
export const config = {
  matcher: ['/', '/((?!_next/static|favicon.ico|logo.svg).*)'],
};
