'use client';
import Link from 'next/link';

import ThemeToggle from './theme-toggle';
import Profile from './profile/profile';
import {BellIcon} from '@radix-ui/react-icons';
import {Search} from './search';
import {useAuth} from '@/components/contexts/auth-provider';

export function Navbar() {
  const {currentUser} = useAuth();
  return (
    <div className='border-b fixed'>
      <nav className='flex h-16 w-screen items-center justify-between px-3 bg-navBackground'>
        <Link href='/examples/dashboard' className='font-medium transition-colors hover:text-primary text-lg'>
          WeChess
        </Link>
        <div className='flex space-x-2 lg:space-x-3 items-center'>
          <Search />
          {/* <BellIcon className='h-[1.5rem] w-[1.5rem]' /> */}
          <ThemeToggle />
          {currentUser && <Profile />}
        </div>
      </nav>
    </div>
  );
}
