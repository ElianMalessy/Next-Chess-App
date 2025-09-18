'use client';
import Board from '@/components/board/board';
import useGameStore, {useEndStateStore} from '@/lib/hooks/useStateStore';
import {realtimeDB} from '@/components/firebase';
import {ref, get, set, update, onValue} from '@firebase/database';
import {useEffect, useState, useMemo} from 'react';
import { useGameEndDetection } from '@/lib/hooks/useGameEndDetection';

export default function Client({currentUserID, gameID}: {currentUserID: string; gameID: string}) {
  const dbRef = useMemo(() => ref(realtimeDB, `${gameID}`), [gameID]);
  const {setDbRef} = useEndStateStore();
  const {setPlayerColor, setFENFromFirebase, setTurn, setCastling, setEnPassent, FEN} = useGameStore();
  const {setCheckmate, setStalemate} = useEndStateStore();
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');

  // Hook to detect game endings and save completed games
  useGameEndDetection(gameID, player1, player2, FEN);

  useEffect(() => {
    setDbRef(dbRef);
    
    get(dbRef).then((snapshot) => {
      if (!snapshot.exists()) {
        // First player to join becomes player_1 (white)
        set(dbRef, {
          checkmate: false,
          stalemate: false,
          FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
          turn: 'w',
          castling: 'KQkq',
          enPassent: '-',
          player_1: currentUserID,
        });
        setPlayerColor('w'); // First player is white
        setPlayer1(currentUserID);
        return;
      }
      
      const data = snapshot.val();
      
      // Determine player color based on existing game state
      if (data.player_1 === currentUserID) {
        // Current user is player 1 (white)
        setPlayerColor('w');
        setPlayer1(currentUserID);
        if (data.player_2) setPlayer2(data.player_2);
      } else if (data.player_2 === currentUserID) {
        // Current user is player 2 (black)
        setPlayerColor('b');
        setPlayer2(currentUserID);
        setPlayer1(data.player_1);
      } else if (!data.player_2) {
        // Current user is joining as player 2 (black)
        update(dbRef, {
          player_2: currentUserID,
        });
        setPlayerColor('b');
        setPlayer2(currentUserID);
        setPlayer1(data.player_1);
      } else {
        // Game is full, current user becomes spectator
        setPlayerColor('spectator');
        setPlayer1(data.player_1);
        setPlayer2(data.player_2);
      }

      setFENFromFirebase(data.FEN);
      setTurn(data.turn, null);
      setCastling(data.castling, null);
      setEnPassent(data.enPassent, null);
    });
  }, [dbRef, currentUserID]);

  useEffect(() => {
    const unsubscribe = onValue(ref(realtimeDB, `${gameID}`), (snapshot: any) => {
      if (!snapshot.exists()) return;
      const data = snapshot.val();
      setFENFromFirebase(data.FEN);
      setTurn(data.turn, null);
      setCastling(data.castling, null);
      setEnPassent(data.enPassent, null);
      setCheckmate(data.checkmate, null);
      setStalemate(data.stalemate, null);
    });
    
    return () => {
      unsubscribe();
    };
  }, [gameID]);

  return <Board realGame={true} />;
}
