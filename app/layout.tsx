import './globals.css';
import Providers from './(contexts)/providers';

export const metadata = {
  title: 'Chess For Friends',
  description: 'Created by Elian Hijmans Malessy',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en'>
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
