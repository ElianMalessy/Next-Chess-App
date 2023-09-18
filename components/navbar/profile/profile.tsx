'use client';
import Image from 'next/image';
import {useRouter} from 'next/navigation';

import {AvatarIcon, GearIcon, FaceIcon, EnvelopeClosedIcon, ExitIcon} from '@radix-ui/react-icons';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/components/contexts/auth-provider';

export default function Profile() {
  const {currentUser, logout} = useAuth();
  const router = useRouter();

  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-11 w-11 rounded-full'>
          <Avatar className='h-11 w-11'>
            <Image
              src={currentUser?.photoURL || defaultImg}
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
            <p className='text-sm font-medium leading-none'>{currentUser?.displayName || 'user'}</p>
            <p className='text-xs leading-none text-muted-foreground'>{currentUser?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(`/user/${currentUser?.displayName?.replaceAll(' ', '_')}`)}>
            Profile
            <DropdownMenuShortcut>
              <AvatarIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/friends')}>
            Friends
            <DropdownMenuShortcut>
              <FaceIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Messages
            <DropdownMenuShortcut>
              <EnvelopeClosedIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>
              <GearIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await logout();
            router.push('/login');
          }}
        >
          Log out
          <DropdownMenuShortcut>
            <ExitIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
