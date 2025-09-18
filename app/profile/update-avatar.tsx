'use client';

import {validate} from 'uuid';
import {useEffect, useState} from 'react';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useAuthStore} from '@/lib/hooks/useAuthStore';
import Modal from './modal';
import getImageAspectRatio from '@/lib/server-actions/get-image-aspect-ratio';
import UsernameDisplay from './username-display';

export default function UpdateAvatarEdit() {
  const {currentUser} = useAuthStore();
  const [aspectRatio, setAspectRatio] = useState(1);
  const [token, setToken] = useState('');
  
  const currentUserData = {
    photoURL: currentUser?.photoURL,
    scale: 1,
    startOffset: {x: 0, y: 0},
  };

  useEffect(() => {
    if (currentUser) {
      currentUser.getIdToken().then(setToken);
      if (currentUser.photoURL) {
        getImageAspectRatio(currentUser.photoURL).then(setAspectRatio);
      }
    }
  }, [currentUser]);

  if (!currentUser || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className='w-full flex items-center justify-center'>
      <Card className='flex flex-row items-center w-full max-w-md py-2'>
        <div className='ml-4'>
          <Modal
            token={token}
            currentUserId={currentUser.uid}
            currentUserData={currentUserData}
            aspectRatio={aspectRatio}
          />
        </div>
        <div className='flex-1'>
          <CardHeader className='pb-2'>
            <UsernameDisplay />
          </CardHeader>
        </div>
      </Card>
    </div>
  );
}
