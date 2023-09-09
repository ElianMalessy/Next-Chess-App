'use client';
import {useEffect} from 'react';
import Link from 'next/link';

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

import Board from '@/components/board/board';
import useGameStore from '@/hooks/useStateStore';

export default function Home() {
  const {setPlayerColor, setFENFromFirebase, setCastling, setEnPassent, setTurn, setCheck} = useGameStore(
    (state) => state
  );
  const addablePieces = ['P', 'N', 'B', 'R', 'Q', 'p', 'n', 'b', 'r', 'q'];

  useEffect(() => {
    setPlayerColor('default');
    setFENFromFirebase('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    setCastling('KQkq', null);
    setEnPassent('-', null);
    setTurn('w', null);
    setCheck(false, null);
  }, [setPlayerColor, setFENFromFirebase, setCastling, setEnPassent, setTurn, setCheck]);
  useEffect(() => {
    localStorage.removeItem('local-store');
  });

  return (
    <div className='flex h-full w-full flex-row items-center justify-center'>
      <div className='grid 2xs:grid-rows-6 2xs:grid-cols-1 2xs:gap-2 lg:grid-rows-1 lg:grid-cols-5 lg:gap-8 mt-20 max-w-screen p-6'>
        <div className='2xs:row-start-3 lg:row-start-1 lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Homepage</CardTitle>
              <CardDescription>Discover chess as you wait for your friends!</CardDescription>
            </CardHeader>
          </Card>
          <div className='grid grid-column gap-8 p-2'>
            <Button asChild className='w-full'>
              <Link href='/game/test'>Play with friends</Link>
            </Button>
            <Button asChild className='w-full'>
              <Link href='/board-editor'>Board Editor & Analysis</Link>
            </Button>
            <Button asChild className='w-full'>
              <Link href='/archive'>Previous Games</Link>
            </Button>
          </div>
        </div>
        <div className='flex justify-center items-center 2xs:row-span-2 2xs:row-start-4 lg:col-span-3 lg:row-span-1 2xs:h-[100vw] sm:h-auto'>
          <div>
            <Board />
          </div>
        </div>
      </div>
    </div>
  );
}
