import './globals.css';
import type {Metadata} from 'next';
import Providers from '../components/contexts/providers';
import {Navbar} from '@/components/navbar/navbar';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body>
        <Providers>
          <Navbar />
          <main className='h-screen w-screen p-2'>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
