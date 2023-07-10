import Link from 'next/link';

import ThemeToggle from './theme-toggle';
import Profile from './profile/profile-image';
import {BellIcon, MagnifyingGlassIcon} from '@radix-ui/react-icons';
import {Search} from './search';

export function Navbar() {
  return (
    <nav className={'flex min-w-full min-h-full items-center justify-between'}>
      <Link href='/examples/dashboard' className='text-sm font-medium transition-colors hover:text-primary'>
        WeChess
      </Link>
      <div className='flex space-x-2 lg:space-x-3 items-center'>
        <Search />
        <BellIcon className='h-[1.2rem] w-[1.2rem]' />
        <Profile />
        <ThemeToggle />
      </div>
    </nav>
  );
}
