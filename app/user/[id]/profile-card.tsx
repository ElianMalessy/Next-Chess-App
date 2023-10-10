'use client';
import Image from 'next/image';
import {validate} from 'uuid';
import {useEffect, useState} from 'react';

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import NonGameBoard from '@/components/board/non-game-board';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';
import UserCardContent from '@/components/user-card-content';
import {useFriendsStore} from '@/lib/hooks/useFriendsStore';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {FriendRequest} from '@/lib/types/kv-types';

export default function ProfileCard({
  pageUser,
  pageUserId,
  pageUsername,
  currentUser,
  friend,
  userCreationTime,
  isOldFriend,
}: {
  pageUser: any;
  pageUserId: string;
  pageUsername: string;
  currentUser: any;
  friend: any;
  userCreationTime: any;
  isOldFriend: number;
}) {
  const {friendsList, friendRequestsList} = useFriendsStore();
  const [friendState, setFriendState] = useState(friend && !friend.isRequest ? friend : null);
  const [friendRequestState, setFriendRequestState] = useState(friend && friend.isRequest ? friend : null);
  console.log(friend);
  const [openFriendDialog, setOpenFriendDialog] = useState(false);
  const [openFriendRequestDialog, setOpenFriendRequestDialog] = useState(false);

  useEffect(() => {
    if (!friendState) return;
    for (let i = 0; i < friendsList.length; i++) {
      if (friendsList[i].uid === friendState.uid) {
        setFriendState(friendsList[i]);
        setOpenFriendDialog(true);
      }
    }
  }, [friendsList, friendState]);
  useEffect(() => {
    for (let i = 0; i < friendRequestsList.length; i++) {
      if (friendRequestsList[i].uid === currentUser.uid) {
        setFriendRequestState(friendRequestsList[i]);
        setOpenFriendRequestDialog(true);
      }
    }
  }, [friendRequestsList, currentUser]);

  return (
    <>
      {!pageUser ? (
        <div className='w-[calc(100vw-1rem)] flex items-center flex-col gap-2'>
          <div className='text-2xl'>404 - User Not Found</div>
          <div className='relative h-[min(560px,95vw)] w-[min(560px,95vw)]'>
            <NonGameBoard />
          </div>
        </div>
      ) : (
        <div className='w-full flex items-center flex-col'>
          <Card className='flex flex-row items-center w-[50%] py-2'>
            <div className='ml-8'>
              <Dialog open={openFriendDialog} onOpenChange={setOpenFriendDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Friendship!</DialogTitle>
                    {friendState && (
                      <DialogDescription>
                        {friendState.old
                          ? `You and ${pageUsername} are already friends`
                          : `You and ${pageUsername} are now friends`}
                      </DialogDescription>
                    )}
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Dialog open={openFriendRequestDialog} onOpenChange={setOpenFriendRequestDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Friend request sent</DialogTitle>
                    {friendRequestState && (
                      <DialogDescription>
                        {`You have been on ${pageUsername}'s friend requests list since: ${new Date(
                          friendRequestState.since * 1000
                        )}`}
                      </DialogDescription>
                    )}
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <div className='w-[96px] h-[96px] overflow-hidden cursor-pointer opacity-100 hover:opacity-75 rounded-full relative'>
                <Image
                  src={pageUser.photoURL}
                  alt='user-profile-picture'
                  fill
                  objectFit='contain'
                  priority
                  style={{
                    transform: `scale(${useProfilePicStore.getState().scale}) translate(${
                      (useProfilePicStore.getState().startOffset.x / useProfilePicStore.getState().scale) * (96 / 288)
                    }px, ${
                      (useProfilePicStore.getState().startOffset.y / useProfilePicStore.getState().scale) * (96 / 288)
                    }px)`,
                  }}
                />
              </div>
            </div>
            <div>
              <CardHeader>
                <CardTitle>
                  {pageUsername ? (validate(pageUsername) ? `anonymous (${pageUsername})` : pageUsername) : 'user'}
                </CardTitle>
                {friendState && !friendState.isRequest && (
                  <CardDescription>
                    {friendState.since !== '' && `Friends since: ${new Date(friendState.since * 1000)}`}
                  </CardDescription>
                )}
                <CardDescription>{userCreationTime && `Joined: ${new Date(userCreationTime)}`}</CardDescription>
              </CardHeader>
              {pageUserId !== currentUser.uid && (
                <CardContent className='w-full flex gap-2'>
                  <UserCardContent
                    currentUser={currentUser}
                    pageUser={{photoURL: pageUser.photoURL, username: pageUsername, uid: pageUserId}}
                    isOldFriend={isOldFriend ? true : false}
                    friendRequestValue={friend ? friend.isRequest : false}
                  />
                </CardContent>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
