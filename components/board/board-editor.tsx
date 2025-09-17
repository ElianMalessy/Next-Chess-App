'use client';
import Board from './board';
import useGameStore, {useEndStateStore} from '@/lib/hooks/useStateStore';
import {useEffect} from 'react';

export default function BoardEditor() {
  const {setPlayerColor, setFENFromFirebase, setTurn, setCastling, setEnPassent, setCheck} = useGameStore();
  const {setCheckmate, setStalemate, setDbRef} = useEndStateStore();

  useEffect(() => {
    // Set up board editor mode - no database connection
    setDbRef(null); // No database reference for local-only mode
    setPlayerColor('default'); // Allow both colors to move
    setFENFromFirebase('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
    setCastling('KQkq', null);
    setEnPassent('-', null);
    setTurn('w', null);
    setCheck(false, null);
    setCheckmate(false, null);
    setStalemate(false, null);
  }, [setPlayerColor, setFENFromFirebase, setCastling, setEnPassent, setTurn, setCheck, setCheckmate, setStalemate, setDbRef]);

  return <Board realGame={false} />;
}
