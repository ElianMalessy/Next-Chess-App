'use client';
import Image from 'next/image';
import {UserX, MessageSquarePlus, Swords} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import AvatarEdit from './avatar-editor';
import {useAuthStore} from '@/hooks/useAuthStore';
import NonGameBoard from '@/components/board/non-game-board';
import FriendDialog from './friend-dialog';
import {useState} from 'react';

export default function ProfileCard({
  username,
  friendRequest,
  userImg,
  userEmail,
}: {
  username: string;
  friendRequest: boolean;
  userImg: string;
  userEmail: string;
}) {
  const {currentUser} = useAuthStore();
  const [avatarClick, setAvatarClick] = useState(false);
  const img: any = userImg;
  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <>
      {false ? (
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

              {username.replaceAll('_', ' ') === currentUser?.displayName && (
                <Dialog open={avatarClick} onOpenChange={setAvatarClick}>
                  {/* <DialogHeader>
                  </DialogHeader> */}

                  <DialogContent>
                    <AvatarEdit img={img || defaultImg} />
                    upload file
                  </DialogContent>
                </Dialog>
              )}
              <Avatar className='w-24 h-24' onClick={() => setAvatarClick(true)}>
                <Image src={img || defaultImg} alt='user-profile-picture' width={96} height={96} priority />
              </Avatar>
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
