'use server';
import {ref, get, set, update} from '@firebase/database';
import {realtimeDB} from '@/components/firebase';
import getCurrentUser from '@/components/server-actions/getCurrentUser';
import {kv} from '@vercel/kv';
import Client from './client';

export default async function Server({id}: {id: string}) {
  const currentUser = await getCurrentUser();
  const dbRef = ref(realtimeDB, `${id}`);
  // const localStore = JSON.parse((await kv.get(id)) || '');
  let playerColor = 'w';
  let FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  let turn = 'w';
  let castling = 'KQkq';
  let enPassent = '-';
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
      return;
    }
    if (!snapshot.val().player_2 && snapshot.val().player_1 !== currentUser?.uid) {
      update(dbRef, {
        player_2: currentUser?.uid,
      });
      playerColor = 'b';
    } else if (currentUser?.uid === snapshot.val().player_2) {
      playerColor = 'b';
    }

    FEN = snapshot.val().FEN;
    turn = snapshot.val().turn;
    castling = snapshot.val().castling;
    enPassent = snapshot.val().enPassent;
  });
  return (
    <div className='flex h-screen w-screen flex-row items-center justify-center'>
      <div className='flex justify-center items-center'>
        <Client FEN={FEN} turn={turn} castling={castling} enPassent={enPassent} playerColor={playerColor} ref={dbRef} />
      </div>
    </div>
  );
}
