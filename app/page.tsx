'use client';
import Board from '@/components/board/board';
import useGameStore from '@/hooks/useStateStore';
import {useEffect} from 'react';

export default function Home() {
  const {setPlayerColor, setFENFromFirebase, setCastling, setEnPassent, setTurn, setCheck} = useGameStore(
    (state) => state
  );
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
    <div className='flex h-screen w-screen flex-row items-center justify-center'>
      <div className='flex justify-center items-center'>
        <Board />
      </div>
    </div>
  );
}
