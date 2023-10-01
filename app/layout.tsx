import './globals.css';
import type {Metadata} from 'next';

import Providers from '@/components/contexts/providers';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'WeChess Website',
  description: 'Play chess with your friends',
  viewport: {width: 'device-width', initialScale: 1},
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body className='h-screen w-screen'>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
