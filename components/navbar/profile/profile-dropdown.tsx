'use client';
import {useRouter} from 'next/navigation';

import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import {AvatarIcon, GearIcon, FaceIcon, EnvelopeClosedIcon, ExitIcon} from '@radix-ui/react-icons';
import {useAuthStore} from '@/hooks/useAuthStore';

export default function ProfileDropdown() {
  const {currentUser, logout} = useAuthStore();
  const router = useRouter();
  return (
    <>
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
        <DropdownMenuItem onClick={() => router.push('/messages')}>
          Messages
          <DropdownMenuShortcut>
            <EnvelopeClosedIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
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
    </>
  );
}
