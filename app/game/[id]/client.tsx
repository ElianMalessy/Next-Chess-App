'use client';
import Board from '@/components/board/board';
import useGameStore, {useEndStateStore} from '@/hooks/useStateStore';
export default function Client({
  FEN,
  playerColor,
  turn,
  castling,
  enPassent,
  ref
}: {
  FEN: string;
  playerColor: string;
  turn: string;
  castling: string;
  enPassent: string;
  ref: any
}) {
  const {setTurn, setCastling, setEnPassent, setFENFromFirebase, setPlayerColor} = useGameStore();
  setFENFromFirebase(FEN);
  setPlayerColor(playerColor);
  setTurn(turn, null);
  setCastling(castling, null);
  setEnPassent(enPassent, null);
  const {setDbRef} = useEndStateStore()
  setDbRef(ref)
  

  return <Board />;
}
