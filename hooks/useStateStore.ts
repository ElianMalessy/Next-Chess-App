import {create} from 'zustand';
import {persist, devtools} from 'zustand/middleware';
import {update, DatabaseReference} from '@firebase/database';

interface State {
  FEN: string;
  playerColor: string;
  turn: string;
  castling: string;
  enPassent: string;
  board: string[][];

  setFENFromFirebase: (FEN: string) => void;
  setFENFromBoard: (board: string[][], dbRef: DatabaseReference | null) => void;
  setTurn: (turn: string, dbRef: DatabaseReference | null) => void;
  setPlayerColor: (playerColor: string) => void;
  setBoard: (board: string[][]) => void;
  setCastling: (castling: string, dbRef: DatabaseReference | null) => void;
  setEnPassent: (enPassent: string, dbRef: DatabaseReference | null) => void;
}
const store = (set: any) => ({
  FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
  playerColor: 'default',
  turn: 'w',
  castling: 'KQkq',
  enPassent: '-',
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
    set((state: State) => ({
      ...state,
      FEN: FEN,
      board: tempBoard,
    }));
  },
  setFENFromBoard: (board: string[][], dbRef: DatabaseReference | null) => {
    let tempFEN = '';
    set((state: State) => {
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
      if (dbRef) {
        update(dbRef, {
          FEN: tempFEN,
        });
      }
      return {...state, FEN: tempFEN};
    });
  },

  setTurn: (turn: string, dbRef: DatabaseReference | null) => {
    set((state: State) => ({
      ...state,
      turn: turn,
    }));
    if (dbRef) {
      update(dbRef, {
        turn: turn,
      });
    }
  },
  setCastling: (castling: string, dbRef: DatabaseReference | null) => {
    set((state: State) => ({
      ...state,
      castling: castling,
    }));
    if (dbRef) {
      update(dbRef, {
        castling: castling,
      });
    }
  },
  setEnPassent: (enPassent: string, dbRef: DatabaseReference | null) => {
    set((state: State) => ({
      ...state,
      enPassent: enPassent,
    }));
    if (dbRef) {
      update(dbRef, {
        enPassent: enPassent,
      });
    }
  },

  setPlayerColor: (playerColor: string) => {
    set((state: State) => ({
      ...state,
      playerColor: playerColor,
    }));
  },
  setBoard: (board: string[][]) => {
    console.log(board);
    set((state: State) => ({
      ...state,
      board: board,
    }));
  },
});

const useStateStore = create<State>()(
  devtools(
    persist(store, {
      name: 'local-store',
      skipHydration: true,
    })
  )
);

export default useStateStore;
