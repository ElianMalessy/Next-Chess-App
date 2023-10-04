'use client';
import {UserX, MessageSquarePlus, Swords, UserPlus} from 'lucide-react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

import {CardContent} from '@/components/ui/card';
import removeFriend, {removeFriendRequest} from '@/lib/server-actions/remove-friend';
import addFriend from '@/lib/server-actions/add-friend';
import type {Dispatch, SetStateAction} from 'react';

export default function UserCardContent({
  currentUser,
  pageUser,
  isOldFriend,
  isFriend,
  friendRequest,
  setFriends,
  setRequests,
}: {
  currentUser: any;
  pageUser: any;
  isOldFriend: number;
  isFriend: boolean;
  friendRequest?: any;
  setFriends?: Dispatch<SetStateAction<any[]>>;
  setRequests?: Dispatch<SetStateAction<any[]>>;
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
                  onClick={async () => {
                    const newFriend = await addFriend(
                      currentUser,
                      {photoURL: pageUser.photoURL, uid: pageUser.uid, username: pageUser.displayName},
                      isOldFriend
                    );
                    if (friendRequest && setFriends && setRequests && newFriend) {
                      setFriends((friends) => {
                        friends.push(newFriend);
                        return friends;
                      });
                      setRequests((requests) => {
                        requests.splice(friendRequest, 1);
                        return requests;
                      });
                    } else if (!friendRequest && setRequests && newFriend) {
                      setRequests((requests) => {
                        requests.push(newFriend);
                        return requests;
                      });
                    }
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
                <UserX
                  strokeWidth={1}
                  onClick={async () => {
                    if (friendRequest) {
                      await removeFriendRequest(currentUser, pageUser);
                      if (setRequests) {
                        setRequests((requests) => {
                          requests.splice(friendRequest, 1);
                          return requests;
                        });
                      }
                      return;
                    }

                    await removeFriend(currentUser, pageUser);
                    if (setFriends) {
                      setFriends((friends) => {
                        friends.splice(pageUser, 1);
                        return friends;
                      });
                    }
                  }}
                  className='cursor-pointer'
                />
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
