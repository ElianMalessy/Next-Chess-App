'use client';
import ThemeProvider from './theme-provider';
import {useAuthStore} from '@/hooks/useAuthStore';
import {useEffect} from 'react';
import type {User} from '@firebase/auth';
import {onIdTokenChanged} from '@firebase/auth';
import {auth} from '@/components/firebase';

export default function Providers({children}: {children: React.ReactNode}) {
  const {setCurrentUser} = useAuthStore();
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
  }, [setCurrentUser]);
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      {children}
    </ThemeProvider>
  );
}
