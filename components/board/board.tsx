'use client';
import {useEffect, useMemo, useRef} from 'react';
import {cn} from '@/lib/utils';
import {onValue, ref, push, set, child} from '@firebase/database';

import Piece from './piece';
import useGameStore from '@/lib/hooks/useStateStore';

import classes from './board.module.css';

export default function Board({realGame}: {realGame: boolean}) {
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
            column={column - 1}
            row={row - 1}
            realGame={realGame}
          />
        );
        index++;
      }
      return tempBoardFiller;
    } else if (playerColor === 'w' || (playerColor === 'default' && !realGame)) {
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
            realGame={realGame}
          />
        );
        index++;
      }
      return tempBoardFiller;
    }
  }, [FEN, playerColor, realGame]);

  return <div className={cn(classes.board, 'rounded-md')}>{boardFiller}</div>;
}
