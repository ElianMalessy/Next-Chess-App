'use client';
import {useState} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';

export default function FriendDialog({username, friend, old}: {username: string; friend: boolean; old: boolean}) {
  const [openDialog, setOpenDialog] = useState(friend);

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
