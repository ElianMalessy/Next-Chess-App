import {useState, useRef, useEffect} from 'react';

import useWindowDimensions from '@/hooks/useWindowDimensions';
import useBoardStore from '@/hooks/useBoardStore';
import {showPossibleMoves} from './moveFunctions';
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
  const [piecePosition, setPiecePosition] = useState({x: column, y: row});

  const [isDragging, setIsDragging] = useState(false);
  const [squares, setSquares] = useState<number[][]>([[]]);

  const initialPiecePosition = useRef({x: column, y: row});
  const initialMousePosition = useRef({x: 0, y: 0});
  const initialOffsetPiecePosition = useRef({x: 0, y: 0});

  const board = useBoardStore((state) => state.board);
  useEffect(() => {
    function possibleMove(row: number, column: number) {
      for (let i = 0; i < squares?.length; i++) {
        if (Math.abs(row - squares[i][0]) < 0.5 && Math.abs(column - squares[i][1]) < 0.5) return true;
      }
      return false;
    }
    function handleMouseMove(e: any) {
      if (isDragging) {
        const newX = initialOffsetPiecePosition.current.x + e.clientX - initialMousePosition.current.x;
        const newY = initialOffsetPiecePosition.current.y + e.clientY - initialMousePosition.current.y;
        setPiecePosition({x: newX / scale, y: newY / scale});
      }
    }
    function handleMouseUp() {
      if (isDragging) {
        setIsDragging(false);
        if (possibleMove(piecePosition.y, piecePosition.x)) {
          console.log('possible');
          return;
        }
        initialMousePosition.current.x = initialPiecePosition.current.x * scale;
        initialMousePosition.current.y = initialPiecePosition.current.y * scale;

        setPiecePosition({x: initialPiecePosition.current.x, y: initialPiecePosition.current.y});
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
  }, [isDragging, piecePosition, board, scale, squares]);

  const [highlightedSquares, setHighlightedSquares]: [React.JSX.Element[], any] = useState([]);
  function highlightSquares(row: number, column: number) {
    setSquares(showPossibleMoves(board[row][column], row, column, board, '-'));
  }

  useEffect(() => {
    if (squares.length === 1) return;
    const highlightedSquaresFiller: React.JSX.Element[] = [];
    squares?.forEach((square, key) => {
      highlightedSquaresFiller.push(
        <div key={key} className={classes['hint']} style={{top: square[0] * scale, left: square[1] * scale}} />
      );
    });
    setHighlightedSquares(highlightedSquaresFiller);
  }, [scale, squares]);
  // mousedown on a piece creates a new div on the possible move squares with the circle css class, ends on mouseup
  function handleMouseDown(e: any) {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      if (!Number.isInteger(piecePosition.y) || !Number.isInteger(piecePosition.x)) return;
      highlightSquares(piecePosition.y, piecePosition.x);
      setSquares(showPossibleMoves(board[piecePosition.y][piecePosition.x], row, column, board, '-'));
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
        setHighlightedSquares([]);
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
        }}
        onMouseDown={(e) => handleMouseDown(e)}
      />
      {highlightedSquares}
    </>
  );
}
