import Image from 'next/image';
import {UserX, MessageSquarePlus, Swords} from 'lucide-react';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import AvatarEdit from './avatar-editor';
import NonGameBoard from '@/components/board/non-game-board';
import FriendDialog from './friend-dialog';

export default async function ProfileCard({
  friendRequest,
  username,
  userImg,
  currentUserName,
}: {
  friendRequest: boolean;
  username: string;
  userImg: string;
  currentUserName: string;
}) {
  const img: any = userImg;
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
              {false && <FriendDialog username={username} friendRequest={friendRequest} />}

              {username && username.replaceAll('_', ' ') === currentUserName ? (
                <AvatarEdit img={img} />
              ) : (
                <Avatar className='w-24 h-24'>
                  <Image src={img} alt='user-profile-picture' width={96} height={96} priority />
                </Avatar>
              )}
            </div>
            <div>
              <CardHeader>
                <CardTitle>{username.replaceAll('_', ' ') || 'user'}</CardTitle>
                {/* <CardDescription>{since !== '' && `Friends since: ${since}`}</CardDescription>
                <CardDescription>
                  {currentUser?.metadata.creationTime &&
                    `Joined: ${new Date(currentUser?.metadata.creationTime).toString()}`}
                </CardDescription> */}
              </CardHeader>
              <CardContent className='w-full flex gap-2'>
                <Swords strokeWidth={1} />
                <MessageSquarePlus strokeWidth={1} />
                <UserX strokeWidth={1} />
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
