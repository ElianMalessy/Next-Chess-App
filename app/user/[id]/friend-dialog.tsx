'use client';
import {useEffect, useState, useRef} from 'react';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
// import {useAuth} from '@/components/contexts/auth-provider';
import {useAuthStore} from '@/hooks/useAuthStore';
import AddFriend from './add-friend';

export default function FriendDialog({username, friendRequest}: {username: string; friendRequest: boolean}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [alert, setAlert] = useState('');
  const {currentUser} = useAuthStore();
  const firstRender = useRef(true);
  useEffect(() => {
    if (
      !(currentUser?.displayName && username && firstRender.current) ||
      currentUser?.displayName === username ||
      !friendRequest
    )
      return;

    firstRender.current = false;
    (async () => {
      const newFriend = await AddFriend(currentUser?.displayName || '', username);
      newFriend ? setAlert(`You and ${username} are now friends`) : setAlert(`You and ${username} are already friends`);
      setOpenDialog(true);
    })();
  }, [currentUser, username, friendRequest]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Friendship!</DialogTitle>
          <DialogDescription>{alert}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
