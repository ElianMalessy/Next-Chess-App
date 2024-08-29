'use client';
import ThemeProvider from './theme-provider';
import { useEffect } from 'react';

import type { User } from '@firebase/auth';
import { onIdTokenChanged } from '@firebase/auth';
import { auth } from '@/components/firebase';
import { useAuthStore } from '@/lib/hooks/useAuthStore';
import { useProfilePicStore } from '@/lib/hooks/useProfilePicStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { setCurrentUser } = useAuthStore();
  const { setImg } = useProfilePicStore();

  useEffect(() => {
    async function handleIdTokenChanged(user: User | null) {
      if (user) {
        setCurrentUser(user);
        if (user.photoURL) setImg(user.photoURL);
      }
    }
    async function registerChangeListener() {
      return onIdTokenChanged(auth, handleIdTokenChanged);
    }
    const unsubscribePromise = registerChangeListener();

    return () => {
      unsubscribePromise.then((unsubscribe) => unsubscribe());
    };
  }, [setCurrentUser, setImg]);
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      {children}
    </ThemeProvider>
  );
}
