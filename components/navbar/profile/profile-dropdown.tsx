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
import {useProfilePicStore} from '@/hooks/useProfilePicStore';

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
          setImg(
            'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a'
          );
          setScale(1);
          setStartOffset({x: 0, y: 0});
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
