'use client';
import useGameStore from '@/hooks/useStateStore';
import {useEffect} from 'react';
import Board from './board';
export default function NonGameBoard() {
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
  return <Board realGame={false} />;
}
