'use client';
import Image from 'next/image';
import {useEffect} from 'react';

import {Avatar} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
// import {useAuth} from '@/components/contexts/auth-provider';
import {useAuthStore} from '@/hooks/useAuthStore';
import {useProfilePicStore} from '@/hooks/useProfilePicStore';
import ProfileDropdown from './profile-dropdown';

export default function Profile() {
  const {scale, startOffset, img} = useProfilePicStore();
  useEffect(() => {
    useProfilePicStore.persist.rehydrate();
  }, []);
  const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-11 w-11 rounded-full'>
          <Avatar className='h-11 w-11'>
            {img && (
              <Image
                src={img}
                alt='currentUser-profile-picture'
                width={44}
                height={44}
                style={{
                  transform: `scale(${scale}) translate(${(startOffset.x / scale) * 0.11}px, ${
                    (startOffset.y / scale) * 0.11
                  }px)`,
                }}
                priority
              />
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {useAuthStore.getState().currentUser?.displayName
                ? uuidPattern.test(useAuthStore.getState().currentUser?.displayName ?? '')
                  ? 'anonymous'
                  : useAuthStore.getState().currentUser?.displayName
                : 'user'}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>{useAuthStore.getState().currentUser?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ProfileDropdown />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
