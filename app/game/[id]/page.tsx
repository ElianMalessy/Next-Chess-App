'use client';
import {useRouter} from 'next/navigation';
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

  const firstRender = useRef(true);
  useEffect(() => {
    if (!(firstRender.current === true && auth.currentUser && params.id)) return;
    console.log(auth);
    firstRender.current = false;
    get(ref(database, `game/${params.id}`)).then((snapshot) => {
      if (!snapshot.exists()) {
        set(ref(database, `game/${params.id}`), {
          checkmate: false,
          FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -',
          turn: 'white',
          player_1: auth.currentUser?.uid,
          player_2: auth.currentUser?.uid,
        });
      } else {
        console.log(snapshot.val());
      }
    });
  }, [auth, params.id]);

  return (
    <div className='flex h-screen w-screen flex-row items-center justify-center'>
      <div className='flex justify-center items-center'>
        <Board playerColor={playerColor} FEN={FEN} />
      </div>
    </div>
  );
}
