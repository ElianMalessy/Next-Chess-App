'use server';
import ThemeProvider from './theme-provider';
import AuthProvider from './auth-provider';
import getCurrentUser from '@/components/server-actions/getCurrentUser';

export default async function Providers({children}: {children: React.ReactNode}) {
  const currentUser = await getCurrentUser();
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <AuthProvider defaultUser={currentUser}>{children}</AuthProvider>
    </ThemeProvider>
  );
}
