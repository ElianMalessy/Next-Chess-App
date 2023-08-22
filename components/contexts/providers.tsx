'use client';
import {AuthProvider} from './auth-provider';
import {ThemeProvider} from './theme-provider';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
