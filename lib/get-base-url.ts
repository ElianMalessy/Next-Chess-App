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
  
  // Check for custom production URL
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  
  // Check for deployment URL (some platforms use this)
  if (process.env.DEPLOY_URL) {
    return process.env.DEPLOY_URL;
  }
  
  // Check for site URL (Netlify uses this)
  if (process.env.URL) {
    return process.env.URL;
  }
  
  // Development fallback
  return 'http://localhost:3000';
}