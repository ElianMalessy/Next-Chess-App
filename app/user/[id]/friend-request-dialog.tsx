'use client';
import {useState, useEffect} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';

export default function FriendRequestDialog({username, since}: {username: string; since: number}) {
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    setOpenDialog(true);
  }, []);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Friend request sent</DialogTitle>
          <DialogDescription>
            {`You have been on ${username}'s friend requests list since: ${new Date(since * 1000)}`}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
