'use client';
import {useState} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';

export default function FriendDialog({username, friends, old}: {username: string; friends: boolean; old: boolean}) {
  const [openDialog, setOpenDialog] = useState(friends);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Friendship!</DialogTitle>
          <DialogDescription>
            {old ? `You and ${username} are already friends` : `You and ${username} are now friends`}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
