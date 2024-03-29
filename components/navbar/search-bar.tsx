'use client';
import Link from 'next/link';
import {useState, useRef, useMemo, useEffect} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {MagnifyingGlassIcon} from '@radix-ui/react-icons';
import {Input} from '@/components/ui/input';
import Fuse from 'fuse.js';
import {Button} from '@/components/ui/button';
import {useAuthStore} from '@/lib/hooks/useAuthStore';

export default function SearchBar({users}: {users: any}) {
  const {currentUser} = useAuthStore();
  const [usersSearchList, setUsersSearchList] = useState(users);
  const [search, setSearch] = useState('');
  const [clicked, setClicked] = useState(false);

  const glassVariants = {
    animate: {x: -5},
  };
  const barVariants = {
    animate: {width: 200, scale: 1},
  };
  const fuseOptions = {
    keys: ['username'],
  };
  const usersFuse = useRef(new Fuse(users, fuseOptions));
  const searchUsersMemo = useMemo(() => {
    const usersDivArray: any[] = [];
    if (typeof window !== 'undefined' && usersSearchList) {
      let updatedIndex = 6;
      for (let i = 0; i < Math.min(updatedIndex, usersSearchList.length); i++) {
        let userValues = usersSearchList[i];
        if (usersSearchList[i].item) userValues = userValues.item;
        if (userValues.uid === currentUser?.uid) {
          updatedIndex++;
          continue;
        }
        usersDivArray.push(
          <Button key={i} className='w-full h-[1.5rem] p-1' variant={'link'} asChild>
            <Link
              className='w-full h-full'
              href={
                window.location.protocol +
                '//' +
                window.location.host +
                `/user/${userValues.username.replaceAll(' ', '_')}`
              } // do this for friends as well
            >
              {userValues.username}
            </Link>
          </Button>
        );
      }
    }

    return usersDivArray;
  }, [usersSearchList, currentUser]);
  useEffect(() => {
    if (users && usersSearchList.length === 0 && search === '') setUsersSearchList(users);
  }, [usersSearchList, users, search]);

  return (
    <div className='flex items-center cursor-pointer'>
      <AnimatePresence>
        <motion.div initial={{x: 0}} animate={clicked ? 'animate' : ''} exit={{x: 0}} variants={glassVariants}>
          <MagnifyingGlassIcon onClick={() => setClicked((c) => !c)} className='h-[1.7rem] w-[1.7rem]' />
        </motion.div>
        {clicked && (
          <motion.div
            key='searchbar'
            initial={{width: 0, scale: 0}}
            animate={clicked ? 'animate' : ''}
            exit={{width: 0, scale: 0}}
            variants={barVariants}
            className='relative w-full'
          >
            <Input
              type='search'
              placeholder='Search for users...'
              onChange={(search: any) => {
                setSearch(search.target.value);
                setUsersSearchList(usersFuse.current.search(search.target.value));
              }}
            />
            <div className='flex flex-col rounded-md gap-1 w-full absolute border bg-popover p-1 text-popover-foreground shadow-md mt-2'>
              {searchUsersMemo}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
