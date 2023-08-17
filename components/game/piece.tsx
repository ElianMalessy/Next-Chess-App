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
  const [squares, setSquares] = useState<number[][]>();

  const initialPiecePosition = useRef({x: scale * column, y: scale * row});
  const initialMousePosition = useRef({x: 0, y: 0});
  const initialOffsetPiecePosition = useRef({x: 0, y: 0});

  const board = useBoardStore((state) => state.board);
  useEffect(() => {
    function possibleMove(row: number, column: number) {
      squares?.forEach((square) => {
        if (row === square[0] && column === square[1]) return true;
      });
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
        if (possibleMove(piecePosition.y / scale, piecePosition.x / scale)) {
          return;
        }
        initialMousePosition.current = initialPiecePosition.current;
        setPiecePosition({x: initialPiecePosition.current.x / scale, y: initialPiecePosition.current.y / scale});
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

  const [highlightedSquares, setHighlightedSquares]: [React.JSX.Element[] | undefined, any] = useState();
  function highlightSquares(row: number, column: number) {
    // console.log(showPossibleMoves(board[row][column], row, column, board, '-'));
    const highlightedSquaresFiller: React.JSX.Element[] = [];
    const tempSquares: number[][] | undefined = showPossibleMoves(board[row][column], row, column, board, '-');
    setSquares(tempSquares);
    console.log(scale);
    tempSquares?.forEach((square, key) => {
      highlightedSquaresFiller.push(
        <div key={key} className={classes['hint']} style={{top: square[0] * scale, left: square[1] * scale}} />
      );
    });
    setHighlightedSquares(highlightedSquaresFiller);
  }

  const generateHighlightedSquares = () => {
    const highlightedSquares = squares?.map((square, key) => (
      <div key={key} className={classes['hint']} style={{top: square[0] * scale, left: square[1] * scale}} />
    ));
    return highlightedSquares;
  };
  // mousedown on a piece creates a new div on the possible move squares with the circle css class, ends on mouseup
  function handleMouseDown(e: any) {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      if (!Number.isInteger(piecePosition.y) || !Number.isInteger(piecePosition.x)) return;
      highlightSquares(piecePosition.y, piecePosition.x);
      initialMousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };

      initialOffsetPiecePosition.current.x =
        initialPiecePosition.current.x - (rect.width / 2 - (initialMousePosition.current.x - rect.x));
      initialOffsetPiecePosition.current.y =
        initialPiecePosition.current.y - (rect.height / 2 - (initialMousePosition.current.y - rect.y));
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
      {generateHighlightedSquares()}
    </>
  );
}
