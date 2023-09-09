'use client';
import {useEffect, useMemo, useRef} from 'react';
import {twMerge} from 'tailwind-merge';

import Piece from './piece';
import useGameStore from '@/hooks/useStateStore';
import classes from './board.module.css';

export default function Board() {
  const {playerColor, FEN} = useGameStore((state) => state);
  useEffect(() => {
    useGameStore.persist.rehydrate();
  }, []);

  const boardFiller = useMemo(() => {
    const tempBoardFiller: React.JSX.Element[] = [];
    // go backwards
    if (playerColor === 'b') {
      for (let i = FEN.length - 1, row = 1, column = 1, index = 0; i >= 0; i--, column++) {
        const spaceNumber = parseInt(FEN[i]);
        if (FEN[i] === '/') {
          row++;
          column = 0;
          continue;
        } else if (!isNaN(spaceNumber)) {
          column += spaceNumber - 1;
        }
        const key = String.fromCharCode(104 - (column - 1)) + '' + row;
        tempBoardFiller.push(
          <Piece
            key={key}
            color={FEN[i] === FEN[i].toLowerCase() ? 'b' : 'w'}
            piece={FEN[i].toLowerCase()}
            column={8 - column}
            row={row - 1}
          />
        );
        index++;
      }
    } else {
      for (let i = 0, row = 8, column = 1, index = 0; i < FEN.length; i++, column++) {
        const spaceNumber = parseInt(FEN[i]);
        if (FEN[i] === '/') {
          row--;
          column = 0;
          continue;
        } else if (!isNaN(spaceNumber)) {
          column += spaceNumber - 1;
          continue;
        }
        const key = String.fromCharCode(104 - (8 - column)) + '' + row;
        tempBoardFiller.push(
          <Piece
            key={key}
            color={FEN[i] === FEN[i].toLowerCase() ? 'b' : 'w'}
            piece={FEN[i].toLowerCase()}
            column={column - 1}
            row={8 - row}
          />
        );
        index++;
      }
    }
    return tempBoardFiller;
  }, [FEN, playerColor]);

  return <div className={twMerge(classes.board, 'rounded-md')}>{boardFiller}</div>;
}
