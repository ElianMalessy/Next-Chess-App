import {create} from 'zustand';
import {persist, devtools} from 'zustand/middleware';

interface State {
  board: string[][];
  FEN: string;
  setBoard: (board: string[][]) => void;
  setFEN: (board: string[][]) => void;
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

  setBoard: (board: string[][]) =>
    set((state: State) => ({
      ...state,
      board: board,
    })),
  setFEN: (board: string[][]) =>
    set((state: State) => {
      let tempFEN = '';
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
    }),
});

const useStore = create<State>()(
  devtools(
    persist(store, {
      name: 'storage',
    })
  )
);

export default useStore;
