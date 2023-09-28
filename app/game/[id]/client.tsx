'use client';
import Board from '@/components/board/board';
import useGameStore, {useEndStateStore} from '@/hooks/useStateStore';
import {realtimeDB} from '@/components/firebase';
import {ref, get, set, update} from '@firebase/database';
import {useEffect} from 'react';

export default function Client({
  currentUserName,
  currentUserEmail,
  currentUserImg,
  currentUserID,
  gameID,
}: {
  currentUserName: string;
  currentUserEmail: string;
  currentUserImg: string;
  currentUserID: string;
  gameID: string;
}) {
  const dbRef = ref(realtimeDB, `${gameID}`);
  const {setDbRef} = useEndStateStore();
  const {setPlayerColor, setFENFromFirebase, setTurn, setCastling, setEnPassent} = useGameStore();

  useEffect(() => {
    setDbRef(dbRef);
    get(dbRef).then((snapshot) => {
      if (!snapshot.exists()) {
        set(dbRef, {
          checkmate: false,
          stalemate: false,
          FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
          turn: 'w',
          castling: 'KQkq',
          enPassent: '-',
          player_1: currentUserID,
        });
        return;
      }
      setPlayerColor('w');
      if (!snapshot.val().player_2 && snapshot.val().player_1 !== currentUserID) {
        update(dbRef, {
          player_2: currentUserID,
        });
        setPlayerColor('b');
      } else if (currentUserID === snapshot.val().player_2) {
        setPlayerColor('b');
      }

      setFENFromFirebase(snapshot.val().FEN);
      setTurn(snapshot.val().turn, null);
      setCastling(snapshot.val().castling, null);
      setEnPassent(snapshot.val().enPassent, null);
    });
  }, []);

  return <Board />;
}
