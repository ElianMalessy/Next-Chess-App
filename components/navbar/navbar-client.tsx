'use client';
import Link from 'next/link';
import ThemeToggle from './theme-toggle';
import Profile from './profile/profile';
import {BellIcon} from '@radix-ui/react-icons';
import MessageIcon from '../messages/message-icon';
import {useCurrentUser} from '@/lib/hooks/useCurrentUser';

export default function NavbarClient() {
  const currentUser = useCurrentUser();
  
  // Build currentUserData from client-side user
  const currentUserData = currentUser
    ? {
        photoURL: (currentUser as any).picture,
        scale: 1,
        startOffset: {x: 0, y: 0},
      }
    : undefined;

  return (
    <div className='border-b w-screen'>
      <nav className='flex w-full h-16 items-center justify-between px-3 bg-navBackground'>
        <Link href='/' className='font-medium transition-colors hover:text-primary text-lg'>
          WeChess
        </Link>
        <div className='flex space-x-2 lg:space-x-3 items-center'>
          {/* <Search /> */}
          <Link href="/messages">
            <MessageIcon />
          </Link>
          {/* <BellIcon className='h-[1.5rem] w-[1.5rem]' /> */}
          <ThemeToggle />
          <Profile currentUserData={currentUserData} />
        </div>
      </nav>
    </div>
  );
}
