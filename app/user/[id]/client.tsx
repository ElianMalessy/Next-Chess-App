'use client';
import {useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {doc, getDoc, setDoc, serverTimestamp} from '@firebase/firestore';

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {firestore} from '@/components/firebase';
import {useAuth} from '@/components/contexts/auth-provider';

export default function Client({username, alert, userEmail}: {username: string; alert: string; userEmail: string}) {
  const friend = useSearchParams().get('friend');
  const {currentUser} = useAuth();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (alert !== '') setOpenDialog(true);
    (async () => {
      if (!friend || !currentUser?.email || !username || username === currentUser?.displayName || userEmail === '')
        return;

      const userRef = doc(firestore, 'users', userEmail, 'friends', currentUser?.email);
      const userDocSnap = await getDoc(userRef);
      if (userDocSnap.exists()) {
        return;
      }

      const timestamp = serverTimestamp();
      setDoc(userRef, {
        since: timestamp,
      });

      const currentUserRef = doc(firestore, 'users', currentUser?.email, 'friends', userEmail);
      setDoc(currentUserRef, {
        since: timestamp,
      });
    })();
  }, [currentUser, friend, username, alert, userEmail]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renewing Friendship!</DialogTitle>
          <DialogDescription>{alert}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
