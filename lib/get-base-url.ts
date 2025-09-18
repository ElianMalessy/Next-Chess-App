export function getBaseUrl() {
  // Client-side
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Server-side - check for production environment
  // Vercel automatically sets VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Custom production URL (set this in your deployment environment)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Development fallback
  return 'http://localhost:3000';
}