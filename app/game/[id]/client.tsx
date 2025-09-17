'use client';
import Board from '@/components/board/board';
import useGameStore, {useEndStateStore} from '@/lib/hooks/useStateStore';
import {realtimeDB} from '@/components/firebase';
import {ref, get, set, update, onValue} from '@firebase/database';
import {useEffect, useState} from 'react';
import { useGameEndDetection } from '@/lib/hooks/useGameEndDetection';

export default function Client({currentUserID, gameID}: {currentUserID: string; gameID: string}) {
  const dbRef = ref(realtimeDB, `${gameID}`);
  const {setDbRef} = useEndStateStore();
  const {setPlayerColor, setFENFromFirebase, setTurn, setCastling, setEnPassent, FEN} = useGameStore();
  const {setCheckmate, setStalemate} = useEndStateStore();
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  // Hook to detect game endings and save completed games
  useGameEndDetection(gameID, player1, player2, FEN);

  useEffect(() => {
    setDbRef(dbRef);
    setPlayerColor('w');
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
      const data = snapshot.val();
      if (!data.player_2 && data.player_1 !== currentUserID) {
        update(dbRef, {
          player_2: currentUserID,
        });
        console.log(currentUserID);
        setPlayerColor('b');
        setPlayer2(currentUserID);
      } else if (currentUserID === data.player_2) {
        setPlayerColor('b');
        setPlayer2(currentUserID);
      }
      
      // Set player IDs for game tracking
      setPlayer1(data.player_1 || '');
      if (data.player_2) setPlayer2(data.player_2);

      setFENFromFirebase(data.FEN);
      setTurn(data.turn, null);
      setCastling(data.castling, null);
      setEnPassent(data.enPassent, null);
    });
    onValue(ref(realtimeDB, `${gameID}`), (snapshot: any) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      setFENFromFirebase(data.FEN);
      setTurn(data.turn, null);
      setCastling(data.castling, null);
      setEnPassent(data.enPassent, null);
      setCheckmate(data.checkmate, null);
      setStalemate(data.stalemate, null);
    });
  }, []);

  return <Board realGame={true} />;
}
