import {create} from 'zustand';
import {persist, devtools} from 'zustand/middleware';

interface BoardState {
  board: string[][];
  setBoard: (board: string[][]) => void;
}
const boardStore = (set: any) => ({
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
  setBoard: (board: string[][]) => set({board}),
});

const useBoardStore = create<BoardState>()(
  devtools(
    persist(boardStore, {
      name: 'board-storage',
    })
  )
);

export default useBoardStore;
