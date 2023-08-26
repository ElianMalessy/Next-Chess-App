import {useState, useRef, useEffect, useContext, useCallback} from 'react';

import useStateStore from '@/hooks/useStateStore';
import {showPossibleMoves} from './moveFunctions';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import {getColor} from './utilityFunctions';
import {DbRefContext} from '@/app/game/[id]/page';

import classes from './board.module.css';
export default function Piece({
  piece,
  color,
  column,
  row,
}: {
  piece: string;
  color: string;
  column: number;
  row: number;
}) {
  const divRef: any = useRef();
  const {width} = useWindowDimensions();
  const scale = 64 > width / 8 ? width / 8 : 64;
  const [zIndex, setZIndex] = useState(1);
  const dbRef = useContext(DbRefContext);

  const {board, turn, playerColor, setBoard, setTurn, setFENFromBoard} = useStateStore((state) => state);

  const [piecePosition, setPiecePosition] = useState({x: column, y: row});
  const [isDragging, setIsDragging] = useState(false);
  const [squares, setSquares] = useState<number[][]>([[]]);

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

      const newPosition = possibleMove(piecePosition.y, piecePosition.x);
      if (newPosition && (playerColor === turn || playerColor === 'default')) {
        setPiecePosition({x: newPosition[1], y: newPosition[0]});
        setSquares([]);
        setZIndex(1);

        const boardCopy = board;
        boardCopy[newPosition[0]][newPosition[1]] =
          board[initialPiecePosition.current.y][initialPiecePosition.current.x];
        boardCopy[initialPiecePosition.current.y][initialPiecePosition.current.x] = '1';
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
    dbRef,
    isDragging,
    scale,
    turn,
    setBoard,
    setFENFromBoard,
    playerColor,
    setTurn,
    possibleMove,
    piecePosition,
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
        (getColor(board[piecePosition.y][piecePosition.x]) !== playerColor && playerColor !== 'default')
      )
        return;

      const rect = divRef.current.getBoundingClientRect();
      console.log(piecePosition, board);
      setSquares(
        showPossibleMoves(board[piecePosition.y][piecePosition.x], piecePosition.y, piecePosition.x, board, '-')
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
    [board, piecePosition, scale, playerColor]
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
      {scale &&
        squares[0] &&
        squares[0].length > 0 &&
        squares.map((square, key) => {
          return (
            <div key={key} className={classes['hint']} style={{top: square[0] * scale, left: square[1] * scale}} />
          );
        })}
    </>
  );
}
