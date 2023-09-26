import Image from 'next/image';

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
import ProfileDropdown from './profile-dropdown';

export default async function Profile() {
  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-11 w-11 rounded-full'>
          <Avatar className='h-11 w-11'>
            <Image
              src={useAuthStore.getState().currentUser?.photoURL || defaultImg}
              alt='currentUser-profile-picture'
              width={44}
              height={44}
              loading='lazy'
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {useAuthStore.getState().currentUser?.displayName || 'user'}
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
