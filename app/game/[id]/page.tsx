'use client';
import {ref, get, set} from '@firebase/database';
import {database} from '@/components/firebase';

import useStore from '@/hooks/useStore';
import Board from '@/components/board/board';
import {useAuth} from '@/components/contexts/auth-provider';
import {useEffect, useRef} from 'react';

export default function Game({params}: {params: {id: string}}) {
  const auth = useAuth();

  const FEN = useStore((state) => state.FEN);
  const playerColor = useStore((state) => state.playerColor);
  const setPlayerColor = useStore((state) => state.setPlayerColor);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current === false || !auth.currentUser || !params.id || playerColor !== '') return;
    firstRender.current = false;
    get(ref(database, `${params.id}`)).then((snapshot) => {
      if (!snapshot.exists()) {
        set(ref(database, `${params.id}`), {
          checkmate: false,
          FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -',
          turn: 'w',
          player_1: auth.currentUser?.uid,
          player_2: auth.currentUser?.uid,
        });
        setPlayerColor('white');
      } else if (playerColor === '') {
        set(ref(database, `${params.id}`), {
          player_2: auth.currentUser?.uid,
        });
        setPlayerColor('b');
      }
    });
  }, [auth, params.id, playerColor, setPlayerColor]);

  return (
    <div className='flex h-screen w-screen flex-row items-center justify-center'>
      <div className='flex justify-center items-center'>
        <Board playerColor={playerColor} FEN={FEN} />
      </div>
    </div>
  );
}
