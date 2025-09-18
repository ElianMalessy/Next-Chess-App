import {useState, useRef, useEffect, useContext, useCallback, memo} from 'react';
import {update} from '@firebase/database';

import useGameStore, {useEndStateStore} from '@/lib/hooks/useStateStore';
import useWindowDimensions from '@/lib/hooks/useWindowDimensions';

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
    setFENFromFirebase,
  } = useGameStore((state: any) => state);
  const {setCheckmate, setStalemate, capturedPieces, setCapturedPieces, dbRef, checkmate, stalemate} = useEndStateStore(
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

      const newPosition = possibleMove(
        playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? piecePosition.y : 7 - piecePosition.y,
        playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? piecePosition.x : 7 - piecePosition.x
      );
      if (newPosition && (playerColor === 'default' || (playerColor === turn && turn === color && playerColor !== 'spectator'))) {
        // For black players, the newPosition is in visual coordinates, need to convert back to board coordinates
        const boardRow = playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? newPosition[0] : 7 - newPosition[0];
        const boardCol = playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? newPosition[1] : 7 - newPosition[1];
        
        setPiecePosition({x: boardCol, y: boardRow});
        setSquares([]);
        setZIndex(1);
        if (
          board[boardRow][boardCol] !== '1' &&
          color !== getColor(board[boardRow][boardCol])
        ) {
          capturedPieces.push(board[boardRow][boardCol]);
          setCapturedPieces(capturedPieces, dbRef);
        }

        const boardCopy = board;
        boardCopy[boardRow][boardCol] =
          board[initialPiecePosition.current.y][initialPiecePosition.current.x];
        boardCopy[initialPiecePosition.current.y][initialPiecePosition.current.x] = '1';

        // promotion
        if (piece === 'p' && color === 'b' && boardRow === 7) board[boardRow][boardCol] = 'q';
        else if (piece === 'p' && color === 'w' && boardRow === 0) board[boardRow][boardCol] = 'Q';

        let tempEnPassent = '-';
        if (newPosition.length === 3) {
          // En passant - convert capture square coordinates back to board coordinates
          const captureRow = playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? newPosition[2] : 7 - newPosition[2];
          capturedPieces.push(board[captureRow][boardCol]);
          setCapturedPieces(capturedPieces, dbRef);
          boardCopy[captureRow][boardCol] = '1'; // enPassent
        } else if (newPosition.length === 4 && piece.toLowerCase() === 'p') {
          // Pawn double move - need to convert coordinates for en passant square notation
          const enPassantCol = playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? newPosition[3] : 7 - newPosition[3];
          const enPassantRow = playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? newPosition[2] : 7 - newPosition[2];
          tempEnPassent = String.fromCharCode(enPassantCol + 'a'.charCodeAt(0)) + (8 - enPassantRow).toString();
          setEnPassent(tempEnPassent, dbRef);
        } else if (piece.toLowerCase() === 'p' && enPassent !== '-') {
          setEnPassent('-', dbRef);
        } else if (newPosition.length === 4) {
          // castling move - convert coordinates back to board coordinates
          const castlingRow = playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? newPosition[0] : 7 - newPosition[0];
          const rookNewCol = playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? newPosition[2] : 7 - newPosition[2];
          const rookOldCol = playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? newPosition[3] : 7 - newPosition[3];
          boardCopy[castlingRow][rookNewCol] = board[castlingRow][rookOldCol];
          boardCopy[castlingRow][rookOldCol] = '1';
        }

        if (isStalemate(board, getColor(boardCopy[boardRow][boardCol]), tempEnPassent)) {
          setPlayerColor('');
          setStalemate(true, dbRef);
        }
        const checkStatus = isCheckmate(board, getColor(boardCopy[boardRow][boardCol]), tempEnPassent);
        if (checkStatus) {
          setCheck(
            findPositionOf(board, getColor(boardCopy[boardRow][boardCol]) === 'w' ? 'k' : 'K'),
            dbRef
          );
          if (checkStatus !== 'check') {
            if (playerColor === 'default') {
              setPlayerColor('default');
              setFENFromFirebase('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
              setCastling('KQkq', null);
              setEnPassent('-', null);
              setTurn('w', null);
              setCheck(false, null);
              setCheckmate(true, dbRef);
              return;
            }
            setCheckmate(true, dbRef);

            // console.log('checkmate');
          }
        } else {
          setCheck(false, dbRef);
        }

        // setCastling
        if (boardCopy[boardRow][boardCol] === 'K') {
          setCastling(castling.replace('KQ', ''), dbRef);
        } else if (boardCopy[boardRow][boardCol] === 'k') {
          setCastling(castling.replace('kq', ''), dbRef);
        } else if (
          boardCopy[boardRow][boardCol] === 'R' &&
          initialPiecePosition.current.y === initialPiecePosition.current.x
        ) {
          setCastling(castling.replace('K', ''), dbRef);
        } else if (
          boardCopy[boardRow][boardCol] === 'R' &&
          initialPiecePosition.current.y === 7 &&
          initialPiecePosition.current.x === 0
        ) {
          setCastling(castling.replace('Q', ''), dbRef);
        } else if (
          boardCopy[boardRow][boardCol] === 'r' &&
          initialPiecePosition.current.y === initialPiecePosition.current.x
        ) {
          setCastling(castling.replace('q', ''), dbRef);
        } else if (
          boardCopy[boardRow][boardCol] === 'R' &&
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
          // In board editor mode, always switch turns to allow both colors to move
          setTurn(turn === 'w' ? 'b' : 'w', null);
        }

        initialPiecePosition.current = {x: boardCol, y: boardRow};
        initialMousePosition.current = {x: 0, y: 0};
        initialOffsetPiecePosition.current = {x: 0, y: 0};
        setZIndex(0);
        return;
      }
      initialMousePosition.current.x = initialPiecePosition.current.x * scale;
      initialMousePosition.current.y = initialPiecePosition.current.y * scale;

      setPiecePosition({x: initialPiecePosition.current.x, y: initialPiecePosition.current.y});
      setZIndex(0);
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
    setFENFromFirebase,
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
      if (
        !divRef.current ||
        !Number.isInteger(piecePosition.x) ||
        !Number.isInteger(piecePosition.y) ||
        playerColor === 'spectator' ||
        (playerColor !== 'default' &&
          getColor(
            playerColor === 'w'
              ? board[piecePosition.y][piecePosition.x]
              : board[7 - piecePosition.y][7 - piecePosition.x]
          ) !== playerColor) ||
        (playerColor === 'default' && realGame) ||
        checkmate ||
        stalemate
      )
        return;

      const rect = divRef.current.getBoundingClientRect();
      setSquares(
        showPossibleMoves(
          playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator'
            ? board[piecePosition.y][piecePosition.x]
            : board[7 - piecePosition.y][7 - piecePosition.x],
          playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? piecePosition.y : 7 - piecePosition.y,
          playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? piecePosition.x : 7 - piecePosition.x,
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
    [board, piecePosition, scale, playerColor, castling, enPassent, realGame, checkmate, stalemate]
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
                  top: playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? square[0] * scale : (7 - square[0]) * scale,
                  left: playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? square[1] * scale : (7 - square[1]) * scale,
                }}
              />
            );
          }
          return (
            <div
              key={key}
              className={classes['hint']}
              style={{
                top: playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? square[0] * scale : (7 - square[0]) * scale,
                left: playerColor === 'w' || playerColor === 'default' || playerColor === 'spectator' ? square[1] * scale : (7 - square[1]) * scale,
              }}
            />
          );
        })}
    </>
  );
}
