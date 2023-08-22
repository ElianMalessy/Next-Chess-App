import {useState, useRef, useEffect, useContext} from 'react';

import useStore from '@/hooks/useStore';
import {showPossibleMoves} from './moveFunctions';
import useWindowDimensions from '@/hooks/useWindowDimensions';

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

  const board = useStore((state) => state.board);
  const setBoard = useStore((state) => state.setBoard);
  const setFEN = useStore((state) => state.setFEN);

  const [piecePosition, setPiecePosition] = useState({x: column, y: row});
  const [isDragging, setIsDragging] = useState(false);
  const [squares, setSquares] = useState<number[][]>([[]]);

  const initialPiecePosition = useRef({x: column, y: row});
  const initialMousePosition = useRef({x: 0, y: 0});
  const initialOffsetPiecePosition = useRef({x: 0, y: 0});

  useEffect(() => {
    function possibleMove(row: number, column: number) {
      for (let i = 0; i < squares?.length; i++) {
        if (Math.abs(row - squares[i][0]) < 0.5 && Math.abs(column - squares[i][1]) < 0.5) return squares[i];
      }
      return false;
    }
    function handleMouseUp() {
      if (isDragging) {
        setIsDragging(false);
        const newPosition = possibleMove(piecePosition.y, piecePosition.x);
        if (newPosition) {
          setPiecePosition({x: newPosition[1], y: newPosition[0]});
          setSquares([]);
          setZIndex(1);

          const boardCopy = board;
          boardCopy[newPosition[0]][newPosition[1]] =
            board[initialPiecePosition.current.y][initialPiecePosition.current.x];
          boardCopy[initialPiecePosition.current.y][initialPiecePosition.current.x] = '1';
          setBoard(boardCopy);
          setFEN(boardCopy);

          initialPiecePosition.current = {x: newPosition[1], y: newPosition[0]};
          initialMousePosition.current = {x: 0, y: 0};
          initialOffsetPiecePosition.current = {x: 0, y: 0};
          return;
        }
        initialMousePosition.current.x = initialPiecePosition.current.x * scale;
        initialMousePosition.current.y = initialPiecePosition.current.y * scale;

        setPiecePosition({x: initialPiecePosition.current.x, y: initialPiecePosition.current.y});
      }
    }
    function handleMouseMove(e: any) {
      if (isDragging) {
        const newX = initialOffsetPiecePosition.current.x + e.clientX - initialMousePosition.current.x;
        const newY = initialOffsetPiecePosition.current.y + e.clientY - initialMousePosition.current.y;
        setPiecePosition({x: newX / scale, y: newY / scale});
      }
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, piecePosition, board, scale, squares, setBoard, setFEN]);

  function handleMouseDown(e: any) {
    if (divRef.current && Number.isInteger(piecePosition.y) && Number.isInteger(piecePosition.x)) {
      const rect = divRef.current.getBoundingClientRect();
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
    }
  }
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
