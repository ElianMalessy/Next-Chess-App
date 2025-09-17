'use client';
import Image from 'next/image';
import {validate} from 'uuid';

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import NonGameBoard from '@/components/board/non-game-board';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';

export default function ProfileCard({
  pageUser,
  pageUserId,
  pageUsername,
  currentUser,
  userCreationTime,
}: {
  pageUser: any;
  pageUserId: string;
  pageUsername: string;
  currentUser: any;
  userCreationTime: any;
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
          <Card className='flex flex-row items-center w-[50%] py-2'>
            <div className='ml-8'>
              <div className='w-[96px] h-[96px] overflow-hidden cursor-pointer opacity-100 hover:opacity-75 rounded-full relative'>
                <Image
                  src={pageUser.photoURL || 'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a'}
                  alt='user-profile-picture'
                  fill
                  priority
                  style={{
                    objectFit: 'cover',
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
                <CardDescription>{userCreationTime && `Joined: ${new Date(userCreationTime)}`}</CardDescription>
              </CardHeader>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
