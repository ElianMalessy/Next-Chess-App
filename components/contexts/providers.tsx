'use client';

import {useEffect} from 'react';
import {useAuthStore} from '@/hooks/useAuthStore';
import type {User} from '@firebase/auth';
import {onIdTokenChanged} from '@firebase/auth';
import {auth} from '@/components/firebase';
import ThemeProvider from './theme-provider';

export default function Providers({children}: {children: React.ReactNode}) {
  const {currentUser, setCurrentUser} = useAuthStore();
  useEffect(() => {
    (async () => {
      const data = await fetch('http://localhost:3000/api/getUser', {next: {revalidate: 30}});
      setCurrentUser(await data.json());
    })();
  }, [setCurrentUser]);
  useEffect(() => {
    async function handleIdTokenChanged(user: User | null) {
      if (user) setCurrentUser(user);
    }
    async function registerChangeListener() {
      return onIdTokenChanged(auth, handleIdTokenChanged);
    }
    const unsubscribePromise = registerChangeListener();

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe());
    };
  }, [currentUser, setCurrentUser]);

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      {children}
    </ThemeProvider>
  );
}
