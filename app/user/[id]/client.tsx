'use client';
import {useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';

import {doc, getDoc, setDoc, serverTimestamp} from '@firebase/firestore';

import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {firestore} from '@/components/firebase';
import AddFriend from './add-friend';

export default function Client({username, alert, currentUser}: {username: string; alert: string; currentUser: any}) {
  const friend = useSearchParams().get('friend');
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    (async () => {
      if (!friend || !currentUser?.name || !username) return;
      const isNewFriend = await AddFriend(currentUser.name.replaceAll(' ', '_'), username);
      console.log(isNewFriend, friend);
      if (!isNewFriend) setOpenDialog(true);

      // const timestamp = serverTimestamp();
      // const userRef = doc(firestore, 'users', userEmail, 'friends', currentUser?.email);
      // setDoc(userRef, {
      //   since: timestamp,
      // });

      // const currentUserRef = doc(firestore, 'users', currentUser?.email, 'friends', userEmail);
      // setDoc(currentUserRef, {
      //   since: timestamp,
      // });
    })();
  }, [currentUser, friend, username, alert]);

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
