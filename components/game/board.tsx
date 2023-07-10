import {useContext, useEffect, useState, useRef} from 'react';
import {Box} from '@chakra-ui/react';
// import classes from './Board.module.css';
// import PieceMemo from './Piece';
// import {PlayerContext, TurnContext, BoardContext} from './Game';
// import findPossibleMoves from './moveFunctions';
// import findPositionOf, {findAllPieces} from './findBoardIndex';

//function Board({FEN, check}: {FEN: string; check: boolean}) {
export default function Board() {
  // const boardArray = useContext(BoardContext);
  // const playerColor = useContext(PlayerContext);
  // const {turn} = useContext(TurnContext);

  // const [board, setBoard] = useState<any>([]);
  // const boardFiller = useRef<any>([]);

  // useEffect(
  //   () => {
  //     console.log('board-render');
  //     const emptyBoard: any[] = [];
  //     boardFiller.current = emptyBoard;
  //     setBoard(emptyBoard);

  //     let index = FEN.length;
  //     while (true) {
  //       if (FEN[index] === 'w' || FEN[index] === 'b') {
  //         index -= 2;
  //         break;
  //       }
  //       index--;
  //     }

  //     // goes backwards in FEN.
  //     if (playerColor === 'black') {
  //       for (let i = index, row = 1, column = 0; i >= 0; i--, column++) {
  //         if (FEN[i] === ' ') break;
  //         if (FEN[i] === '/') {
  //           row++;
  //           column = -1;
  //           continue;
  //         }

  //         // board squares starting from top left to right bottom. a8, b8 to g1, h1
  //         const num = parseInt(FEN[i]);
  //         if (num) {
  //           for (let j = parseInt(FEN[i]); j > 0; j--, column++) {
  //             const key = String.fromCharCode(104 - column) + '' + row;
  //             const tile_class = (column + row) % 2 === 1 ? 'non-colored-tile' : 'colored-tile';
  //             boardFiller.current.push(<div key={key} className={classes[tile_class]} id={'S' + key} />);
  //           }
  //           if (num < 8) {
  //             column--;
  //           }
  //         } else {
  //           // add fmove from fen, also en passent square
  //           const color = FEN[i] === FEN[i].toUpperCase() ? 'white' : 'black';
  //           const key = String.fromCharCode(104 - column) + '' + row;
  //           const tile_class = (column + row) % 2 === 1 ? 'non-colored-tile' : 'colored-tile';

  //           boardFiller.current.push(
  //             <div key={key} className={classes[tile_class]} id={'S' + key}>
  //               <PieceMemo color={color} position={FEN[i] + key} />
  //             </div>
  //           );
  //         }
  //       }
  //     } else {
  //       for (let i = 0, row = 8, column = 0; i < FEN.length; i++, column++) {
  //         if (FEN[i] === ' ') break;
  //         if (FEN[i] === '/') {
  //           row--;
  //           column = -1;
  //           continue;
  //         }

  //         const num = parseInt(FEN[i]);
  //         if (num) {
  //           for (let j = num; j > 0; j--, column++) {
  //             const key = String.fromCharCode(97 + column) + '' + row;
  //             const tile_class = (column + row) % 2 === 0 ? 'non-colored-tile' : 'colored-tile';
  //             boardFiller.current.push(<div key={key} className={classes[tile_class]} id={'S' + key} />);
  //           }
  //           if (num < 8) {
  //             column--;
  //           }
  //         } else {
  //           const color = FEN[i] === FEN[i].toUpperCase() ? 'white' : 'black';
  //           const key = String.fromCharCode(97 + column) + '' + row;
  //           const tile_class = (column + row) % 2 === 0 ? 'non-colored-tile' : 'colored-tile';
  //           // use key instead of ID to move around pieces as that is immutable from the client side
  //           boardFiller.current.push(
  //             <div key={key} className={classes[tile_class]} id={'S' + key}>
  //               <PieceMemo color={color} position={FEN[i] + key} />
  //             </div>
  //           );
  //         }
  //       }
  //     }
  //     setBoard(boardFiller.current);
  //   },
  //   // eslint-disable-next-line
  //   [playerColor]
  // );

  // useEffect(
  //   () => {
  //     if (check) {
  //       console.log(check);
  //       let kingPos;

  //       if (turn[0] === 'w') {
  //         kingPos = findPositionOf(boardArray, 'K');
  //       } else if (turn[0] === 'b') {
  //         kingPos = findPositionOf(boardArray, 'k');
  //       }
  //       findPossibleMoves(check, kingPos, ...findAllPieces(boardArray, turn[0]));
  //       // only use for determining checkmate and possible moves if there is a check
  //     }
  //   },
  //   //eslint-disable-next-line
  //   [check]
  // );

  //fetch('https://lichess1.org/assets/_tPoiFY/images/board/svg/brown.svg');

  return (
    // <Box ref={svgRef}
    // width={svgDimensions.width}
    // height={svgDimensions.height}
    // h='100%' w='100%' backgroundImage={'https://lichess1.org/assets/_tPoiFY/images/board/svg/brown.svg'}></Box>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      style={{width: '100%', height: '100%'}}
      viewBox='0 0 8 8'
      preserveAspectRatio='xMidYMid meet'
      shapeRendering='crispEdges'
    >
      <g id='a'>
        <g id='b'>
          <g id='c'>
            <g id='d'>
              <rect width='1' height='1' fill='#f0d9b5' id='e' />
              <use x='1' y='1' href='#e' xlinkHref='#e' />
              <rect y='1' width='1' height='1' fill='#b58863' id='f' />
              <use x='1' y='-1' href='#f' xlinkHref='#f' />
            </g>
            <use x='2' href='#d' xlinkHref='#d' />
          </g>
          <use x='4' href='#c' xlinkHref='#c' />
        </g>
        <use y='2' href='#b' xlinkHref='#b' />
      </g>
      <use y='4' href='#a' xlinkHref='#a' />
    </svg>
  );
}
