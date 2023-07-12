'use client';
import {useEffect, useRef, useState} from 'react';

import Piece from './pieces';
import classes from './board.module.css';

export default function Board() {
  const [FEN, setFEN] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -');
  const [playerColor, setPlayerColor] = useState('white');
  const [boardArray, setBoardArray]: [React.JSX.Element[] | undefined, any] = useState();

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current && FEN && playerColor) firstRender.current = false;
    else if (!firstRender.current || !FEN || !playerColor) return;

    console.log('board-render', FEN);

    const boardFiller: React.JSX.Element[] = [];
    let index = FEN.length;
    while (true) {
      if (FEN[index] === 'w' || FEN[index] === 'b') {
        index -= 2;
        break;
      }
      index--;
    }

    // goes backwards in FEN.
    if (playerColor === 'black') {
      for (let i = index, row = 1, column = 1; i >= 0; i--, column++) {
        if (FEN[i] === '/') {
          row++;
          column = 0;
          continue;
        } else if (!isNaN(parseInt(FEN[i]))) continue;

        const key = String.fromCharCode(104 - (column - 1)) + '' + row;
        boardFiller.push(
          <div key={key} id={key}>
            <Piece
              color={FEN[i] === FEN[i].toLowerCase() ? 'b' : 'w'}
              piece={FEN[i].toLowerCase()}
              column={8 - column}
              row={row - 1}
            />
          </div>
        );
      }
    } else {
      for (let i = 0, row = 8, column = 1; i <= index; i++, column++) {
        if (FEN[i] === '/') {
          row--;
          column = 0;
          continue;
        } else if (!isNaN(parseInt(FEN[i]))) continue;

        const key = String.fromCharCode(104 - (8 - column)) + '' + row;
        boardFiller.push(
          <div key={key} id={key}>
            <Piece
              color={FEN[i] === FEN[i].toLowerCase() ? 'b' : 'w'}
              piece={FEN[i].toLowerCase()}
              column={column - 1}
              row={8 - row}
            />
          </div>
        );
      }
    }
    setBoardArray(boardFiller);
  }, [playerColor, FEN]);
  return <div className={classes.board}>{boardArray}</div>;
}
