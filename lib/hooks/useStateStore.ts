import {create} from 'zustand';
import {persist, devtools} from 'zustand/middleware';
import {update, ref} from '@firebase/database';
import type {DatabaseReference} from '@firebase/database';

interface EndState {
  checkmate: boolean;
  stalemate: boolean;
  capturedPieces: string[];
  dbRef: any;

  setCheckmate: (checkmate: boolean, dbRef: DatabaseReference | null) => void;
  setStalemate: (stalemate: boolean, dbRef: DatabaseReference | null) => void;
  setCapturedPieces: (capturedPieces: string[], dbRef: DatabaseReference | null) => void;
  setDbRef: (dbRef: DatabaseReference | null) => void;
}
const endStore = (set: any) => ({
  checkmate: false,
  stalemate: false,
  capturedPieces: ['P', 'p'],
  dbRef: null,

  setCheckmate: (checkmate: boolean, dbRef: DatabaseReference | null) => {
    set((state: GameState) => ({
      ...state,
      checkmate: checkmate,
    }));
    if (dbRef && Object.keys(dbRef).length !== 0) {
      update(dbRef, {
        checkmate: checkmate,
      });
    }
  },
  setStalemate: (stalemate: boolean, dbRef: DatabaseReference | null) => {
    set((state: GameState) => ({
      ...state,
      stalemate: stalemate,
    }));
    if (dbRef && Object.keys(dbRef).length !== 0) {
      update(dbRef, {
        stalemate: stalemate,
      });
    }
  },
  setCapturedPieces: (capturedPiece: string[], dbRef: DatabaseReference | null) => {
    set((state: GameState) => ({
      ...state,
      capturedPieces: capturedPiece,
    }));
    if (dbRef && Object.keys(dbRef).length !== 0) {
      update(dbRef, {
        capturedPieces: capturedPiece,
      });
    }
  },
  setDbRef: (dbRef: DatabaseReference | null) => {
    set((state: GameState) => ({
      ...state,
      dbRef: dbRef,
    }));
  },
});

export const useEndStateStore = create<EndState>()(devtools(endStore));

interface GameState {
  FEN: string;
  turn: string;
  playerColor: string;
  board: string[][];
  castling: string;
  enPassent: string;
  check: any;

  setFENFromFirebase: (FEN: string) => void;
  setFENFromBoard: (board: string[][], dbRef: DatabaseReference | null) => void;
  setTurn: (turn: string, dbRef: DatabaseReference | null) => void;
  setPlayerColor: (playerColor: string) => void;
  setBoard: (board: string[][]) => void;
  setCastling: (castling: string, dbRef: DatabaseReference | null) => void;
  setEnPassent: (enPassent: string, dbRef: DatabaseReference | null) => void;
  setCheck: (check: any, dbRef: DatabaseReference | null) => void;
}

const store = (set: any) => ({
  FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  turn: 'w',
  playerColor: 'default',
  board: [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // black
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['1', '1', '1', '1', '1', '1', '1', '1'], // add these up to get the FEN, from left to right
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // white
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ],
  castling: 'KQkq',
  enPassent: '-',
  check: false,

  setFENFromFirebase: (FEN: string) => {
    const tempBoard: string[][] = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1'],
      ['1', '1', '1', '1', '1', '1', '1', '1'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];
    for (let i = 0, row = 0, column = 0; i < FEN.length; i++, column++) {
      const spaceNumber = parseInt(FEN[i]);
      if (FEN[i] === '/') {
        row++;
        column = -1;
        continue;
      } else if (!isNaN(spaceNumber)) {
        for (let j = 0; j < spaceNumber; j++, column++) {
          tempBoard[row][column] = '1';
        }
        column--;
        continue;
      }
      tempBoard[row][column] = FEN[i];
    }
    set((state: GameState) => ({
      ...state,
      FEN: FEN,
      board: tempBoard,
    }));
  },
  setFENFromBoard: (board: string[][], dbRef: DatabaseReference | null) => {
    let tempFEN = '';
    set((state: GameState) => {
      for (let i = 0, spaces = 0, index = 0; i < 8; i++, index++) {
        for (let j = 0; j < 8; j++, index++) {
          if (board[i][j] === '1') spaces++;

          if (spaces > 0 && (board[i][j] !== '1' || j === 7)) {
            tempFEN += spaces.toString();
            spaces = 0;
            if (board[i][j] !== '1') tempFEN += board[i][j];
          } else if (board[i][j] !== '1') tempFEN += board[i][j];
        }
        if (i < 7) tempFEN += '/';
      }
      if (dbRef && Object.keys(dbRef).length !== 0) {
        update(dbRef, {
          FEN: tempFEN,
        });
      }
      return {...state, FEN: tempFEN};
    });
  },

  setTurn: (turn: string, dbRef: DatabaseReference | null) => {
    set((state: GameState) => ({
      ...state,
      turn: turn,
    }));
    if (dbRef && Object.keys(dbRef).length !== 0) {
      update(dbRef, {
        turn: turn,
      });
    }
  },
  setCastling: (castling: string, dbRef: DatabaseReference | null) => {
    set((state: GameState) => ({
      ...state,
      castling: castling,
    }));
    if (dbRef && Object.keys(dbRef).length !== 0) {
      update(dbRef, {
        castling: castling,
      });
    }
  },
  setEnPassent: (enPassent: string, dbRef: DatabaseReference | null) => {
    set((state: GameState) => ({
      ...state,
      enPassent: enPassent,
    }));
    if (dbRef && Object.keys(dbRef).length !== 0) {
      update(dbRef, {
        enPassent: enPassent,
      });
    }
  },

  setPlayerColor: (playerColor: string) => {
    set((state: GameState) => ({
      ...state,
      playerColor: playerColor,
    }));
  },
  setBoard: (board: string[][]) => {
    set((state: GameState) => ({
      ...state,
      board: board,
    }));
  },
  setCheck: (check: any, dbRef: DatabaseReference | null) => {
    set((state: GameState) => ({
      ...state,
      check: check,
    }));
    if (dbRef && Object.keys(dbRef).length !== 0) {
      update(dbRef, {
        check: check,
      });
    }
  },
});

const useGameStore = create<GameState>()(
  devtools(
    persist(store, {
      name: 'game-store',
      skipHydration: true,
    })
  )
);

export default useGameStore;
