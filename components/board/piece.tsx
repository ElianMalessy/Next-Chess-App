import {useState, useRef, useEffect, useContext, useCallback, memo} from 'react';
import {update} from '@firebase/database';

import useGameStore, {useEndStateStore} from '@/hooks/useStateStore';
import useWindowDimensions from '@/hooks/useWindowDimensions';

import isCheckmate, {isStalemate, showPossibleMoves} from './moveFunctions';
import findPositionOf, {getColor} from './utilityFunctions';

import classes from './board.module.css';
export default function Piece({
  piece,
  color,
  column,
  row,
  realGame,
}: {
  piece: string;
  color: string;
  column: number;
  row: number;
  realGame: boolean;
}) {
  const divRef: any = useRef();
  const {width} = useWindowDimensions();
  const scale = Math.min((width - 16) / 8, 70);
  const [zIndex, setZIndex] = useState(1);

  const {
    board,
    turn,
    playerColor,
    enPassent,
    castling,
    check,
    setBoard,
    setTurn,
    setFENFromBoard,
    setCastling,
    setEnPassent,
    setPlayerColor,
    setCheck,
  } = useGameStore((state: any) => state);
  const {setCheckmate, setStalemate, capturedPieces, setCapturedPieces, dbRef} = useEndStateStore(
    (state: any) => state
  );

  const [piecePosition, setPiecePosition] = useState({x: column, y: row});
  const [isDragging, setIsDragging] = useState(false);
  const [squares, setSquares] = useState<number[][]>([]);

  const initialPiecePosition = useRef({x: column, y: row});
  const initialMousePosition = useRef({x: 0, y: 0});
  const initialOffsetPiecePosition = useRef({x: 0, y: 0});

  const possibleMove = useCallback(
    (row: number, column: number) => {
      for (let i = 0; i < squares?.length; i++) {
        if (Math.abs(row - squares[i][0]) < 0.5 && Math.abs(column - squares[i][1]) < 0.5) return squares[i];
      }
      return false;
    },
    [squares]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);

      const newPosition = possibleMove(playerColor === 'w' ? piecePosition.y : 7 - piecePosition.y, piecePosition.x);
      if (newPosition && (playerColor === turn || (playerColor === 'default' && !realGame))) {
        console.log(playerColor, turn);
        setPiecePosition({x: newPosition[1], y: newPosition[0]});
        setSquares([]);
        setZIndex(1);
        if (
          board[newPosition[0]][newPosition[1]] !== '1' &&
          color !== getColor(board[newPosition[0]][newPosition[1]])
        ) {
          capturedPieces.push(board[newPosition[0]][newPosition[1]]);
          setCapturedPieces(capturedPieces, dbRef);
        }

        const boardCopy = board;
        boardCopy[newPosition[0]][newPosition[1]] =
          board[initialPiecePosition.current.y][initialPiecePosition.current.x];
        boardCopy[initialPiecePosition.current.y][initialPiecePosition.current.x] = '1';

        // promotion
        if (piece === 'p' && color === 'b' && newPosition[0] === 7) board[newPosition[0]][newPosition[1]] = 'q';
        else if (piece === 'p' && color === 'w' && newPosition[0] === 0) board[newPosition[0]][newPosition[1]] = 'Q';

        let tempEnPassent = '-';
        if (newPosition.length === 3) {
          capturedPieces.push(board[newPosition[2]][newPosition[1]]);
          setCapturedPieces(capturedPieces, dbRef);
          boardCopy[newPosition[2]][newPosition[1]] = '1'; // enPassent
        } else if (newPosition.length === 4 && piece.toLowerCase() === 'p') {
          tempEnPassent = String.fromCharCode(newPosition[3] + 'a'.charCodeAt(0)) + (8 - newPosition[2]).toString();
          setEnPassent(
            String.fromCharCode(newPosition[3] + 'a'.charCodeAt(0)) + (8 - newPosition[2]).toString(),
            dbRef
          );
        } else if (piece.toLowerCase() === 'p' && enPassent !== '-') {
          setEnPassent('-', dbRef);
        } else if (newPosition.length === 4) {
          // castling move
          boardCopy[newPosition[0]][newPosition[2]] = board[newPosition[0]][newPosition[3]];
          boardCopy[newPosition[0]][newPosition[3]] = '1';
        }

        if (isStalemate(board, getColor(boardCopy[newPosition[0]][newPosition[1]]), tempEnPassent)) {
          setPlayerColor('');
          setStalemate(true, dbRef);
        }
        const checkStatus = isCheckmate(board, getColor(boardCopy[newPosition[0]][newPosition[1]]), tempEnPassent);
        if (checkStatus) {
          setCheck(
            findPositionOf(board, getColor(boardCopy[newPosition[0]][newPosition[1]]) === 'w' ? 'k' : 'K'),
            dbRef
          );
          if (checkStatus !== 'check') {
            setPlayerColor('');
            setCheckmate(true, dbRef);
            console.log('checkmate');
          }
        } else {
          setCheck(false, dbRef);
        }

        // setCastling
        if (boardCopy[newPosition[0]][newPosition[1]] === 'K') {
          setCastling(castling.replace('KQ', ''), dbRef);
        } else if (boardCopy[newPosition[0]][newPosition[1]] === 'k') {
          setCastling(castling.replace('kq', ''), dbRef);
        } else if (
          boardCopy[newPosition[0]][newPosition[1]] === 'R' &&
          initialPiecePosition.current.y === initialPiecePosition.current.x
        ) {
          setCastling(castling.replace('K', ''), dbRef);
        } else if (
          boardCopy[newPosition[0]][newPosition[1]] === 'R' &&
          initialPiecePosition.current.y === 7 &&
          initialPiecePosition.current.x === 0
        ) {
          setCastling(castling.replace('Q', ''), dbRef);
        } else if (
          boardCopy[newPosition[0]][newPosition[1]] === 'r' &&
          initialPiecePosition.current.y === initialPiecePosition.current.x
        ) {
          setCastling(castling.replace('q', ''), dbRef);
        } else if (
          boardCopy[newPosition[0]][newPosition[1]] === 'R' &&
          initialPiecePosition.current.y === 0 &&
          initialPiecePosition.current.x === 7
        ) {
          setCastling(castling.replace('q', ''), dbRef);
        }

        setBoard(boardCopy);
        if (playerColor !== 'default') {
          setFENFromBoard(boardCopy, dbRef);
          setTurn(turn === 'w' ? 'b' : 'w', dbRef);
        } else {
          setFENFromBoard(boardCopy, null);
          setTurn(turn === 'w' ? 'b' : 'w', null);
        }

        initialPiecePosition.current = {x: newPosition[1], y: newPosition[0]};
        initialMousePosition.current = {x: 0, y: 0};
        initialOffsetPiecePosition.current = {x: 0, y: 0};
        return;
      }
      initialMousePosition.current.x = initialPiecePosition.current.x * scale;
      initialMousePosition.current.y = initialPiecePosition.current.y * scale;

      setPiecePosition({x: initialPiecePosition.current.x, y: initialPiecePosition.current.y});
    }
  }, [
    board,
    isDragging,
    scale,
    turn,
    setBoard,
    setFENFromBoard,
    playerColor,
    setTurn,
    possibleMove,
    piecePosition,
    castling,
    setCastling,
    enPassent,
    setEnPassent,
    piece,
    color,
    setPlayerColor,
    setCheck,
    setCheckmate,
    setStalemate,
    setCapturedPieces,
    capturedPieces,
    dbRef,
    realGame,
  ]);

  const handleMouseMove = useCallback(
    (e: any) => {
      if (isDragging) {
        const newX = initialOffsetPiecePosition.current.x + e.clientX - initialMousePosition.current.x;
        const newY = initialOffsetPiecePosition.current.y + e.clientY - initialMousePosition.current.y;
        setPiecePosition({x: newX / scale, y: newY / scale});
      }
    },
    [isDragging, scale]
  );
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMouseDown = useCallback(
    (e: any) => {
      console.log(
        playerColor,
        getColor(
          playerColor === 'w'
            ? board[piecePosition.y][piecePosition.x]
            : board[7 - piecePosition.y][7 - piecePosition.x]
        ),
        board,
        piecePosition
      );
      if (
        !divRef.current ||
        !Number.isInteger(piecePosition.x) ||
        !Number.isInteger(piecePosition.y) ||
        (playerColor !== 'default' &&
          getColor(
            playerColor === 'w'
              ? board[piecePosition.y][piecePosition.x]
              : board[7 - piecePosition.y][7 - piecePosition.x]
          ) !== playerColor) ||
        (playerColor === 'default' && realGame)
      )
        return;

      const rect = divRef.current.getBoundingClientRect();
      setSquares(
        showPossibleMoves(
          playerColor === 'w'
            ? board[piecePosition.y][piecePosition.x]
            : board[7 - piecePosition.y][7 - piecePosition.x],
          playerColor === 'w' ? piecePosition.y : 7 - piecePosition.y,
          playerColor === 'w' ? piecePosition.x : 7 - piecePosition.x,
          board,
          enPassent,
          castling
        )
      );
      setZIndex(2);

      initialMousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };

      initialOffsetPiecePosition.current.x =
        initialPiecePosition.current.x * scale - (rect.width / 2 - (initialMousePosition.current.x - rect.x));
      initialOffsetPiecePosition.current.y =
        initialPiecePosition.current.y * scale - (rect.height / 2 - (initialMousePosition.current.y - rect.y));

      setPiecePosition({
        x: initialOffsetPiecePosition.current.x / scale,
        y: initialOffsetPiecePosition.current.y / scale,
      });
      setIsDragging(true);
    },
    [board, piecePosition, scale, playerColor, castling, enPassent, realGame]
  );

  useEffect(() => {
    const handleDocumentClick = (e: any) => {
      if (divRef.current && !divRef.current.contains(e.target)) {
        setSquares([]);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  return (
    <>
      <div
        ref={divRef}
        className={classes[`${piece}_${color}`]}
        style={{
          top: scale * piecePosition.y,
          left: scale * piecePosition.x,
          zIndex: zIndex,
        }}
        onMouseDown={(e) => handleMouseDown(e)}
      />
      {check && (
        <div
          className={classes[`check`]}
          style={{
            top: scale * check[0],
            left: scale * check[1],
            zIndex: 0,
          }}
        />
      )}

      {scale &&
        squares.length > 0 &&
        squares.map((square, key) => {
          if (board[square[0]][square[1]] !== '1') {
            return (
              <div
                key={key}
                className={classes['capture-hint']}
                style={{
                  top: playerColor === 'w' ? square[0] : (7 - square[0]) * scale,
                  left: playerColor === 'w' ? square[1] : (7 - square[1]) * scale,
                }}
              />
            );
          }
          return (
            <div
              key={key}
              className={classes['hint']}
              style={{
                top: playerColor === 'w' ? square[0] : (7 - square[0]) * scale,
                left: playerColor === 'w' ? square[1] : (7 - square[1]) * scale,
              }}
            />
          );
        })}
    </>
  );
}
