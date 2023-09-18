'use client';
import {useEffect, useRef, createContext} from 'react';
import {ref, get, set, DatabaseReference, update} from '@firebase/database';
import {realtimeDB} from '@/components/firebase';

import {useAuth} from '@/components/contexts/auth-provider';
// import {useAuthStore} from '@/hooks/useAuthStore';
import useGameStore from '@/hooks/useStateStore';
import Board from '@/components/board/board';
import {Navbar} from '@/components/navbar/navbar';

export const DbRefContext = createContext({} as DatabaseReference);
export default function Game({params}: {params: {id: string}}) {
  const {currentUser} = useAuth();
  const dbRef = ref(realtimeDB, `${params.id}`);
  const {FEN, playerColor, setTurn, setCastling, setEnPassent, setFENFromFirebase, setPlayerColor} = useGameStore(
    (state) => state
  );

  const firstRender = useRef(true);
  useEffect(() => {
    if (!firstRender.current || !currentUser || !params.id) return;
    firstRender.current = false;
    get(dbRef).then((snapshot) => {
      if (!snapshot.exists()) {
        set(dbRef, {
          checkmate: false,
          stalemate: false,
          FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
          turn: 'w',
          castling: 'KQkq',
          enPassent: '-',
          player_1: currentUser?.uid,
        });
        setPlayerColor('w');
        setFENFromFirebase('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
        setTurn('w', null);
        setCastling('KQkq', null);
        setEnPassent('-', null);
        return;
      }

      if (!snapshot.val().player_2 && snapshot.val().player_1 !== currentUser?.uid) {
        update(dbRef, {
          player_2: currentUser?.uid,
        });
        setPlayerColor('b');
      } else if (currentUser?.uid === snapshot.val().player_1) {
        setPlayerColor('w');
      } else if (currentUser?.uid === snapshot.val().player_2) {
        setPlayerColor('b');
      }
      setFENFromFirebase(snapshot.val().FEN);
      setTurn(snapshot.val().turn, null);
      setCastling(snapshot.val().castling, null);
      setEnPassent(snapshot.val().enPassent, null);
    });
  }, [
    currentUser,
    params.id,
    playerColor,
    setPlayerColor,
    dbRef,
    FEN,
    setFENFromFirebase,
    setCastling,
    setTurn,
    setEnPassent,
  ]);

  return (
    <>
      <Navbar />
      <main className='h-screen w-screen p-2'>
        <div className='flex h-screen w-screen flex-row items-center justify-center'>
          <div className='flex justify-center items-center'>
            <DbRefContext.Provider value={dbRef}>
              <Board />
            </DbRefContext.Provider>
          </div>
        </div>
      </main>
    </>
  );
}
