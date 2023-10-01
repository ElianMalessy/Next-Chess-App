import Image from 'next/image';
import {UserX, MessageSquarePlus, Swords} from 'lucide-react';

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import AvatarEdit from './avatar-editor';
import NonGameBoard from '@/components/board/non-game-board';
import FriendDialog from './friend-dialog';

export default async function ProfileCard({
  friendRequest,
  username,
  userImg,
  currentUserName,
  friend,
  userCreationTime,
}: {
  friendRequest: boolean;
  username: string;
  userImg: string;
  currentUserName: string;
  friend: any;
  userCreationTime: any;
}) {
  const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return (
    <>
      {!currentUserName ? (
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
              <FriendDialog username={username} friend={friend ? true : false} old={friend?.old} />

              {username && username.replaceAll('_', ' ') === currentUserName ? (
                <AvatarEdit img={userImg} />
              ) : (
                <Avatar className='w-24 h-24'>
                  <Image src={userImg} alt='user-profile-picture' width={96} height={96} priority />
                </Avatar>
              )}
            </div>
            <div>
              <CardHeader>
                <CardTitle>
                  {username ? (uuidPattern.test(username) ? 'anonymous' : username.replaceAll('_', ' ')) : 'user'}
                </CardTitle>
                {friendRequest && friend && (
                  <CardDescription>{friend.since !== '' && `friend since: ${friend.since}`}</CardDescription>
                )}
                <CardDescription>
                  {userCreationTime && `Joined: ${new Date(userCreationTime).toString()}`}
                </CardDescription>
              </CardHeader>
              <CardContent className='w-full flex gap-2'>
                {username && username.replaceAll('_', ' ') !== currentUserName && (
                  <>
                    <Swords strokeWidth={1} />
                    <MessageSquarePlus strokeWidth={1} />
                    <UserX strokeWidth={1} />
                  </>
                )}
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
