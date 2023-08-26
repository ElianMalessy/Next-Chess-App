'use client';
import {useEffect, useRef, useState} from 'react';

import Piece from './piece';
import classes from './board.module.css';
import useStateStore from '@/hooks/useStateStore';

export default function Board() {
  const [boardArray, setBoardArray]: [React.JSX.Element[] | undefined, any] = useState();
  const {playerColor, FEN} = useStateStore((state) => state);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current && FEN && playerColor) firstRender.current = false;
    else return;

    const boardFiller: React.JSX.Element[] = [];
    // go backwards
    if (playerColor === 'b') {
      for (let i = FEN.length - 1, row = 1, column = 1; i >= 0; i--, column++) {
        const spaceNumber = parseInt(FEN[i]);
        if (FEN[i] === '/') {
          row++;
          column = 0;
          continue;
        } else if (!isNaN(spaceNumber)) {
          column += spaceNumber - 1;
        }
        const key = String.fromCharCode(104 - (column - 1)) + '' + row;
        boardFiller.push(
          <Piece
            key={key}
            color={FEN[i] === FEN[i].toLowerCase() ? 'b' : 'w'}
            piece={FEN[i].toLowerCase()}
            column={8 - column}
            row={row - 1}
          />
        );
      }
    } else {
      for (let i = 0, row = 8, column = 1; i < FEN.length; i++, column++) {
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
        boardFiller.push(
          <Piece
            key={key}
            color={FEN[i] === FEN[i].toLowerCase() ? 'b' : 'w'}
            piece={FEN[i].toLowerCase()}
            column={column - 1}
            row={8 - row}
          />
        );
      }
    }
    setBoardArray(boardFiller);
  }, [playerColor]);
  return <div className={classes.board}>{boardArray}</div>;
}
