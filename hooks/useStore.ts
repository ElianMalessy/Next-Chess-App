import {create} from 'zustand';
import {persist, devtools} from 'zustand/middleware';
import {update, ref, DatabaseReference} from '@firebase/database';

interface State {
  board: string[][];
  FEN: string;
  playerColor: string;
  turn: string;

  setBoard: (board: string[][], dbRef: DatabaseReference) => void;
  setFEN: (board: string[][], dbRef: DatabaseReference) => void;
  setPlayerColor: (playerColor: string, dbRef: DatabaseReference) => void;
  setTurn: (turn: string, dbRef: DatabaseReference) => void;
}
const store = (set: any) => ({
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
  FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -',
  playerColor: '',
  turn: '',

  setBoard: (board: string[][], dbRef: DatabaseReference) =>
    set((state: State) => ({
      ...state,
      board: board,
    })),
  setFEN: (board: string[][], dbRef: DatabaseReference) => {
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
      return {...state, FEN: tempFEN + ' w KQkq -'};
    });
    update(dbRef, {
      FEN: tempFEN + ' w KQkq -',
    });
  },
  setPlayerColor: (playerColor: string, dbRef: DatabaseReference) => {
    set((state: State) => ({
      ...state,
      playerColor: playerColor,
    }));
    update(dbRef, {
      playerColor: playerColor,
    });
  },
  setTurn: (turn: string, dbRef: DatabaseReference) => {
    set((state: State) => ({
      ...state,
      turn: turn,
    }));
    update(dbRef, {
      turn: turn,
    });
  },
});
// persist(store, {
//   name: 'storage',
// })

const useStore = create<State>()(devtools(store));

export default useStore;
