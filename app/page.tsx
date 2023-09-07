'use client';
import {useEffect} from 'react';

import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import Board from '@/components/board/board';
import useGameStore from '@/hooks/useStateStore';
import {useEndStateStore} from '@/hooks/useStateStore';

export default function Home() {
  const {board, setPlayerColor, setFENFromFirebase, setCastling, setEnPassent, setTurn, setCheck} = useGameStore(
    (state) => state
  );
  const {checkmate, stalemate} = useEndStateStore((state) => state);

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
  useEffect(() => {
    let wQueens = 0;
    let bQueens = 0;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {}
    }
  }, [board]);
  return (
    <div className='flex h-screen w-screen flex-row items-center justify-center'>
      <Card className='flex justify-center items-center'>
        <CardHeader>
          <CardTitle>Practice Board</CardTitle>
          <CardDescription>You can conduct your analysis of games on this board!</CardDescription>
          <CardDescription>
            {checkmate && 'Checkmate'} {stalemate && 'Stalemate'}
          </CardDescription>
        </CardHeader>
        <CardContent className='p-4'>
          <Board />
        </CardContent>
      </Card>
    </div>
  );
}
