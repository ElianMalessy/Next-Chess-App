import Image from 'next/image';
import {validate} from 'uuid';

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import AvatarEdit from './avatar-editor';
import NonGameBoard from '@/components/board/non-game-board';
import FriendDialog from './friend-dialog';
import PageUserCardContent from './profile-card-content';

export default async function ProfileCard({
  friendRequest,
  pageUser,
  pageUsername,
  pageUserID,
  currentUser,
  friend,
  userCreationTime,
  isFriend,
}: {
  friendRequest: boolean;
  pageUser: any;
  pageUsername: string;
  pageUserID: string;
  currentUser: any;
  friend: any;
  userCreationTime: any;
  isFriend: number;
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

              {pageUsername && pageUsername === currentUser.name ? (
                <AvatarEdit img={pageUser.photoURL} />
              ) : (
                <Avatar className='w-24 h-24'>
                  <Image src={pageUser.photoURL} alt='user-profile-picture' width={96} height={96} priority />
                </Avatar>
              )}
            </div>
            <div>
              <CardHeader>
                <CardTitle>
                  {pageUsername ? (validate(pageUsername) ? `anonymous (${pageUsername})` : pageUsername) : 'user'}
                </CardTitle>
                {friendRequest && friend && (
                  <CardDescription>
                    {friend.since !== '' && `Friends since: ${new Date(friend.since * 1000)}`}
                  </CardDescription>
                )}
                <CardDescription>{userCreationTime && `Joined: ${new Date(userCreationTime)}`}</CardDescription>
              </CardHeader>
              <CardContent className='w-full flex gap-2'>
                <PageUserCardContent
                  pageUser={pageUser}
                  currentUser={currentUser}
                  pageUsername={pageUsername}
                  pageUserID={pageUserID}
                  isFriend={isFriend}
                />
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
