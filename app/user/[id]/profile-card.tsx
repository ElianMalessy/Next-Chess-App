import Image from 'next/image';
import {validate} from 'uuid';

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import NonGameBoard from '@/components/board/non-game-board';
import FriendDialog from './friend-dialog';
import FriendRequestDialog from './friend-request-dialog';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';
import UserCardContent from '@/components/user-card-content';

export default function ProfileCard({
  friendRequest,
  pageUser,
  pageUsername,
  currentUser,
  friend,
  userCreationTime,
  isOldFriend,
}: {
  friendRequest: boolean;
  pageUser: any;
  pageUsername: string;
  currentUser: any;
  friend: any;
  userCreationTime: any;
  isOldFriend: number;
}) {
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
          <Card className='flex flex-row items-center w-[50%]'>
            <div className='ml-8'>
              {friend && friend.old && <FriendDialog username={pageUsername} old={friend?.old} />}
              {friend && !friend.photoURL && <FriendRequestDialog username={pageUsername} since={friend.since} />}

              <Avatar className='w-24 h-24'>
                <Image
                  src={pageUser.photoURL}
                  alt='user-profile-picture'
                  width={96}
                  height={96}
                  priority
                  style={{
                    transform: `scale(${useProfilePicStore.getState().scale}) translate(${
                      (useProfilePicStore.getState().startOffset.x / useProfilePicStore.getState().scale) * 0.11
                    }px, ${
                      (useProfilePicStore.getState().startOffset.y / useProfilePicStore.getState().scale) * 0.11
                    }px)`,
                  }}
                />
              </Avatar>
            </div>
            <div>
              <CardHeader>
                <CardTitle>
                  {pageUsername ? (validate(pageUsername) ? `anonymous (${pageUsername})` : pageUsername) : 'user'}
                </CardTitle>
                {friendRequest && friend && friend.photoURL && (
                  <CardDescription>
                    {friend.since !== '' && `Friends since: ${new Date(friend.since * 1000)}`}
                  </CardDescription>
                )}
                <CardDescription>{userCreationTime && `Joined: ${new Date(userCreationTime)}`}</CardDescription>
              </CardHeader>
              <CardContent className='w-full flex gap-2'>
                <UserCardContent
                  currentUser={currentUser}
                  pageUser={pageUser}
                  isOldFriend={isOldFriend}
                  isFriend={friend && friend.photoURL ? true : false}
                />
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
