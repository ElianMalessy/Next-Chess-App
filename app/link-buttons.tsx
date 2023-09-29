'use client';
import Link from 'next/link';
import {Button} from '@/components/ui/button';

export default function LinkButtons() {
  return (
    <>
      <Button asChild className='w-full'>
        <Link href={`/game/${Date.now()}`}>Play with friends</Link>
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
