'use client';
import {UserX, MessageSquarePlus, Swords, UserPlus} from 'lucide-react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

import {CardContent} from '@/components/ui/card';
import removeFriend from '@/lib/server-actions/remove-friend';
import addFriend from '@/lib/server-actions/add-friend';

export default function UserCardContent({
  currentUser,
  pageUser,
  isOldFriend,
  isFriend,
  friendRequest
}: {
  currentUser: any;
  pageUser: any;
  isOldFriend: number;
  isFriend: boolean;
  friendRequest?: boolean
}) {
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
      <TooltipProvider delayDuration={350}>
        <Tooltip>
          <TooltipTrigger asChild>
            <MessageSquarePlus strokeWidth={1} className='cursor-pointer' />
          </TooltipTrigger>
          <TooltipContent>
            <p>message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={350}>
        <Tooltip>
          {!isFriend ? (
            <>
              <TooltipTrigger asChild>
                <UserPlus
                  className='cursor-pointer'
                  strokeWidth={1}
                  onClick={() => {
                    addFriend(
                      currentUser,
                      {photoURL: pageUser.photoURL, uid: pageUser.uid, username: pageUser.displayName},
                      isOldFriend
                    );
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{friendRequest ? 'accept request' : 'friend request'}</p>
              </TooltipContent>
            </>
          ) : (
            <>
              <TooltipTrigger asChild>
                <UserX strokeWidth={1} onClick={() => removeFriend(currentUser, pageUser)} className='cursor-pointer' />
              </TooltipTrigger>
              <TooltipContent>
                <p>unfriend</p>
              </TooltipContent>
            </>
          )}
        </Tooltip>
      </TooltipProvider>
    </CardContent>
  );
}
