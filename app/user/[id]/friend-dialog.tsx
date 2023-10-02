'use client';
import {useState, useEffect} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';

export default function FriendDialog({username, old}: {username: string;  old: boolean}) {
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    setOpenDialog(true)
  }, [])

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
