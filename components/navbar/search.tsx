'use client';

import {useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {MagnifyingGlassIcon} from '@radix-ui/react-icons';
import {Input} from '@/components/ui/input';

export function Search() {
  const [clicked, setClicked] = useState(false);
  const glassVariants = {
    animate: {x: -5},
  };
  const barVariants = {
    animate: {width: 200, scale: 1},
  };
  return (
    <div className='flex items-center cursor-pointer'>
      <motion.div initial={{x: 0}} animate={clicked ? 'animate' : ''} exit={{x: 0}} variants={glassVariants}>
        <MagnifyingGlassIcon onClick={() => setClicked((c) => !c)} className='h-[1.7rem] w-[1.7rem]' />
      </motion.div>
      <AnimatePresence>
        {clicked && (
          <motion.div
            key='searchbar'
            initial={{width: 0, scale: 0}}
            animate={clicked ? 'animate' : ''}
            exit={{width: 0, scale: 0}}
            variants={barVariants}
          >
            <Input type='search' placeholder='Search for players...' />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
