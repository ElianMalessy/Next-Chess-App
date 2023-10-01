'use client';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';

export default function LinkButtons() {
  const [timestamp, setTimestamp] = useState('');
  useEffect(() => {
    setTimestamp(Date.now().toString());
  }, []);
  return (
    <>
      <Button asChild className='w-full'>
        <Link href={`/game/${timestamp}`}>Play with friends</Link>
      </Button>
      <Button asChild className='w-full'>
        <Link href='/game/test'>Board Editor & Analysis</Link>
      </Button>
      <Button asChild className='w-full'>
        <Link href='/game/test'>Previous Games</Link>
      </Button>
    </>
  );
}
