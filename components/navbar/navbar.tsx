import Link from 'next/link';

import ThemeToggle from './theme-toggle';
import Profile from './profile/profile';
import {BellIcon} from '@radix-ui/react-icons';
import {Search} from './search';

export default function Navbar() {
  return (
    <div className='border-b w-screen'>
      <nav className='flex w-full h-16 items-center justify-between px-3 bg-navBackground'>
        <Link href='/examples/dashboard' className='font-medium transition-colors hover:text-primary text-lg'>
          WeChess
        </Link>
        <div className='flex space-x-2 lg:space-x-3 items-center'>
          <Search />
          {/* <BellIcon className='h-[1.5rem] w-[1.5rem]' /> */}
          <ThemeToggle />
          <Profile />
        </div>
      </nav>
    </div>
  );
}
