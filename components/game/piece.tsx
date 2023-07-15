import React, {useState, useRef, useEffect} from 'react';

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
  const [isDragging, setIsDragging] = useState(false);
  const divRef: any = useRef();

  const {width} = useWindowDimensions();
  const scale = 64 > width / 8 ? width / 8 : 64;
  const initialPiecePosition = useRef({x: scale * column, y: scale * row});
  const [squares, setSquares] = useState<number[][]>();

  const initialMousePosition = useRef({x: 0, y: 0});
  const [position, setPosition] = useState({x: scale * column, y: scale * row});

  const board = useBoardStore((state) => state.board);
  useEffect(() => {
    function possibleMove(row: number, column: number) {
      squares?.forEach((square) => {
        if (row === square[0] && column === square[1]) return true;
      });
      return false;
    }
    function handleMouseMove(event: any) {
      if (isDragging) {
        const newX = event.clientX - initialMousePosition.current.x + initialPiecePosition.current.x;
        const newY = event.clientY - initialMousePosition.current.y + initialPiecePosition.current.y;
        setPosition({x: newX, y: newY});
      }
    }
    function handleMouseUp() {
      if (isDragging) {
        setIsDragging(false);
        if (possibleMove(position.y / scale, position.x / scale)) {
          return;
        }
        initialMousePosition.current = initialPiecePosition.current;
        setPosition(initialPiecePosition.current);
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
  }, [isDragging, position, board, scale, squares]);
  function highlightSquares(row: number, column: number) {
    setSquares(showPossibleMoves(board[row][column], row, column, board, '-'));
    console.log(showPossibleMoves(board[row][column], row, column, board, '-'));
  }
  function handleMouseDown(event: any) {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      //console.log(event.clientX, rect.left);
      highlightSquares(position.y / scale, position.x / scale);
      initialMousePosition.current = {
        x: event.clientX,
        y: event.clientY,
      };
      setIsDragging(true);
    }
  }

  return (
    <div
      ref={divRef}
      className={classes[`${piece}_${color}`]}
      style={{
        top: position.y,
        left: position.x,
      }}
      onMouseDown={(e) => handleMouseDown(e)}
    />
  );
}
