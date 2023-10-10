'use client';
import Image from 'next/image';
import {useEffect} from 'react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {useAuthStore} from '@/lib/hooks/useAuthStore';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';
import ProfileDropdown from './profile-dropdown';
import {validate} from 'uuid';

export default function Profile({currentUserData}: {currentUserData: any}) {
  const {scale, startOffset, img} = useProfilePicStore();
  const serverScale = scale ?? currentUserData.scale;
  const serverStartOffset = startOffset ?? currentUserData;
  const serverImg = img ?? currentUserData.photoURL;
  const {currentUser} = useAuthStore();

  useEffect(() => {
    useProfilePicStore.persist.rehydrate();
  }, []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-11 w-11 overflow-hidden cursor-pointer opacity-100 hover:opacity-75 rounded-full relative'
        >
          {serverImg && (
            <Image
              src={serverImg}
              alt='currentUser-profile-picture'
              fill
              objectFit='contain'
              style={{
                transform: `scale(${serverScale}) translate(${serverStartOffset.x * (45 / 288)}px, ${
                  (serverStartOffset.y / serverScale) * (45 / 288)
                }px)`,
              }}
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {currentUser?.displayName
                ? validate(currentUser?.displayName)
                  ? 'anonymous'
                  : currentUser?.displayName
                : 'user'}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>{currentUser?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ProfileDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
