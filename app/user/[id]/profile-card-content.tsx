'use client';
import {UserX, MessageSquarePlus, Swords, UserPlus} from 'lucide-react';

import addFriend from '@/lib/server-actions/add-friend';
import removeFriend from '@/lib/server-actions/remove-friend';
import FriendCardContent from '@/app/friends/friend-card-content';

export default function ProfileCardContent({
  pageUser,
  pageUsername,
  pageUserID,
  currentUser,
  isFriend,
}: {
  pageUser: any;
  pageUsername: string;
  pageUserID: string;
  currentUser: any;
  isFriend: number;
}) {
  return (
    <>
      {isFriend ? (
        <FriendCardContent currentUser={currentUser} friend={pageUser} />
      ) : (
        pageUsername &&
        pageUsername !== currentUser.name && (
          <>
            <Swords strokeWidth={1} />
            <MessageSquarePlus strokeWidth={1} />
            <UserPlus
              strokeWidth={1}
              onClick={() => {
                addFriend(currentUser, pageUser.photoURL, pageUserID, pageUsername, isFriend);
                window.location.reload();
              }}
            />
          </>
        )
      )}
    </>
  );
}
