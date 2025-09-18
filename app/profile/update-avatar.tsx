'use client';

import {validate} from 'uuid';
import {useEffect, useState} from 'react';
import {onAuthStateChanged} from '@firebase/auth';
import type {User} from '@firebase/auth';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {auth} from '@/components/firebase';
import Modal from './modal';
import getImageAspectRatio from '@/lib/server-actions/get-image-aspect-ratio';
import UsernameDisplay from './username-display';

export default function UpdateAvatarEdit() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [token, setToken] = useState('');
  
  const currentUserData = {
    photoURL: currentUser?.photoURL,
    scale: 1,
    startOffset: {x: 0, y: 0},
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setCurrentUser(user);
      if (user) {
        user.getIdToken().then(setToken);
        if (user.photoURL) {
          getImageAspectRatio(user.photoURL).then(setAspectRatio);
        }
      } else {
        setToken('');
        setAspectRatio(1);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!currentUser || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full max-w-md mx-auto flex items-center justify-center'>
      <Card className='flex flex-row items-center w-full py-2 overflow-hidden'>
        <div className='ml-4 flex-shrink-0'>
          <Modal
            token={token}
            currentUserId={currentUser.uid}
            currentUserData={currentUserData}
            aspectRatio={aspectRatio}
          />
        </div>
        <div className='flex-1 min-w-0 pr-4'>
          <CardHeader className='pb-2'>
            <UsernameDisplay />
          </CardHeader>
        </div>
      </Card>
    </div>
  );
}
