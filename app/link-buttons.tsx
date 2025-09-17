'use client';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';
import GameInviteModal from '@/components/game/game-invite-modal';

export default function LinkButtons() {
  const [timestamp, setTimestamp] = useState('');
  useEffect(() => {
    setTimestamp(Date.now().toString());
  }, []);
  return (
    <>
      <GameInviteModal gameId={timestamp} />
      <Button asChild className='w-full'>
        <Link href='/board-editor'>Board Editor & Analysis</Link>
      </Button>
      <Button asChild className='w-full'>
        <Link href='/game/test'>Previous Games</Link>
      </Button>
    </>
  );
}
