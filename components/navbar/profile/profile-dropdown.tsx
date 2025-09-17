'use client';
import {useRouter} from 'next/navigation';

import {
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu';
import {AvatarIcon, GearIcon, EnvelopeClosedIcon, ExitIcon} from '@radix-ui/react-icons';
import {useAuthStore} from '@/lib/hooks/useAuthStore';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';

export default function ProfileDropdown() {
  const {currentUser, logout} = useAuthStore();
  const {setImg, setScale, setStartOffset} = useProfilePicStore();
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
