import Link from 'next/link';

import ThemeToggle from './theme-toggle';
import Profile from './profile/profile-image';
import {BellIcon} from '@radix-ui/react-icons';
import {Search} from './search';

export function Navbar() {
  return (
    <div className='border-b fixed'>
      <nav className='flex h-16 items-center justify-between px-3 bg-navBackground' style={{minWidth: '100vw'}}>
        <Link href='/examples/dashboard' className='font-medium transition-colors hover:text-primary text-lg'>
          WeChess
        </Link>
        <div className='flex space-x-2 lg:space-x-3 items-center'>
          <Search />
          <BellIcon className='h-[1.5rem] w-[1.5rem]' />
          <Profile />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
