'use client';
import Image from 'next/image';
import {useEffect, useState} from 'react';

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
  const {scale, startOffset, img, setScale, setStartOffset, setImg} = useProfilePicStore();
  useEffect(() => {
    setScale(currentUserData.scale);
    setStartOffset(currentUserData.startOffset);
    setImg(currentUserData.photoURL);
  }, [currentUserData, setScale, setStartOffset, setImg]);
  const {currentUser} = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-11 w-11 overflow-hidden cursor-pointer opacity-100 hover:opacity-75 rounded-full relative'
        >
          {img && (
            <Image
              src={img}
              alt='currentUser-profile-picture'
              fill
              style={{
                objectFit: 'cover',
                transform: `scale(${scale}) translate(${startOffset.x * (45 / 288)}px, ${
                  (startOffset.y / scale) * (45 / 288)
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
