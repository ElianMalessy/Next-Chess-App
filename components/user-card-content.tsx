'use client';
import {useState} from 'react';
import {UserX, MessageSquarePlus, Swords, UserPlus} from 'lucide-react';

import removeFriend, {removeFriendRequest} from '@/lib/server-actions/remove-friend';
import addFriend from '@/lib/server-actions/add-friend';

import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {CardContent} from '@/components/ui/card';
import {useFriendsStore} from '@/lib/hooks/useFriendsStore';

export default function UserCardContent({
  currentUser,
  pageUser,
  isOldFriend,
  friendRequestValue,
}: {
  currentUser: any;
  pageUser: any;
  isOldFriend: boolean;
  friendRequestValue?: any;
}) {
  const {addFriendToStore, removeFriendAtStore, addFriendRequestToStore, removeFriendRequestAtStore, friendRequests} =
    useFriendsStore();
  const [isFriend, setIsFriend] = useState(isOldFriend);
  const [isFriendRequest, setIsFriendRequest] = useState(friendRequestValue ? true : false);

  return (
    <CardContent className='w-full flex gap-2 p-0 sm:flex-row 2xs:flex-col'>
      <TooltipProvider delayDuration={350}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Swords strokeWidth={1} className='cursor-pointer' />
          </TooltipTrigger>
          <TooltipContent>
            <p>challenge</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* <TooltipProvider delayDuration={350}>
        <Tooltip>
          <TooltipTrigger asChild>
            <MessageSquarePlus strokeWidth={1} className='cursor-pointer' />
          </TooltipTrigger>
          <TooltipContent>
            <p>message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
      <TooltipProvider delayDuration={350}>
        {!isFriend && (
          <Tooltip>
            <TooltipTrigger asChild>
              <UserPlus
                className='cursor-pointer'
                strokeWidth={1}
                onClick={async () => {
                  const newFriend = await addFriend(currentUser, pageUser, isFriend ? 1 : 0);
                  if (!newFriend) return;
                  if (friendRequestValue) {
                    addFriendToStore(newFriend);
                    removeFriendRequestAtStore(friendRequestValue);
                    setIsFriend(true);
                    return;
                  }
                  addFriendRequestToStore(newFriend);
                  setIsFriendRequest(true);
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{friendRequestValue ? 'accept friend request' : 'friend request'}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {!isFriend && isFriendRequest && (
          <Tooltip>
            <TooltipTrigger asChild>
              <UserX
                strokeWidth={1}
                className='cursor-pointer'
                onClick={async () => {
                  if (friendRequestValue) {
                    setIsFriendRequest(false);
                    await removeFriendRequest(currentUser, pageUser);
                    removeFriendRequestAtStore(friendRequestValue);
                  }
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{'reject friend request'}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {isFriend && (
          <Tooltip>
            <TooltipTrigger asChild>
              <UserX
                strokeWidth={1}
                onClick={async () => {
                  await removeFriend(currentUser, pageUser);
                  removeFriendAtStore(pageUser);
                  setIsFriend(false);
                }}
                className='cursor-pointer'
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>unfriend</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </CardContent>
  );
}
