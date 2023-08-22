import {findAllEnemyPieces, getColor} from './utilityFunctions';

// only used for determining possible moves if its checkmate after a check
export default function getPossibleMoves(
  checkingPieces: string[],
  kingPos: string,
  piecesArray: string[],
  board: string[][]
) {
  // if there are checking pieces, then that means that the move that this player makes has to block those checking pieces
  // use isCheck on all of the possibilities, if its a bishop for example, that means that the move either has to be the king moving out of the way
  // (that can be true for all of them, as long as that next position doesnt return a true in isCheck()), or it can be a piece moving into that diag
  // if there are no possible moves to stop isCheck() as in it always returns true, then it is checkmate and the game ends
  const possibleMoves: string[][] = []; // e.g, [[p, e4], [p, e3], ...], possible squares to block
  const tempPossibleSquares = new Set<string>();

  checkingPieces.forEach((checkingPiece) => {
    if ((checkingPiece[0].toLowerCase() === 'q' || checkingPiece[0] === 'b') && checkingPiece[1] !== kingPos[1]) {
      const squares = movePiecesDiag(checkingPiece, kingPos, board);
      if (Array.isArray(squares)) squares.forEach(tempPossibleSquares.add, tempPossibleSquares);
    }
    if (
      (checkingPiece[0].toLowerCase() === 'r' || checkingPiece[0].toLowerCase() === 'q') &&
      (checkingPiece[1] === kingPos[1] || checkingPiece[2] === kingPos[2])
    ) {
      const squares = movePiecesVertLat(checkingPiece, kingPos, board);
      if (Array.isArray(squares)) squares.forEach(tempPossibleSquares.add, tempPossibleSquares);
    }
    tempPossibleSquares.add(checkingPiece[1] + checkingPiece[2]); // can capture the checking piece to stop the check
    // if the piece is a pawn or a knight, the only way to get unchecked is to move out of the way or to capture them
  });
  console.log(tempPossibleSquares);
  piecesArray.forEach((piece: string) => {
    // if a piece going to this square triggers a discovered check, then dont put this into possible moves
    // since you have the possible squares in which the pieces must go into to protect the king, the next step is to check every piece and see if
    // they can move to protect the king, (not including the king)
    console.log(piece);
    tempPossibleSquares.forEach((square: string) => {
      if (isAttackingDestination[piece[0]](square, piece[1] + piece[2])) {
        possibleMoves.push([piece, square]);
        console.log(piece, square);
      }
    });
  });
  console.log(possibleMoves, 'possibleMoves');
}

function isCheck(kingPos: string, board: string[][]) {
  const pieces = findAllEnemyPieces(board, kingPos[0].toLowerCase() === kingPos[0] ? 'b' : 'w'); //select all of the pieces except for the kings as they cant check each other
  // checks if the move is legal by putting in the destination and looking for checks before actually appending to new square
  const potentialCheckingPieces = [...pieces];
  const checkingPieces: string[] = [];
  potentialCheckingPieces.forEach((piece) => {
    if (isAttackingDestination[piece[0].toLowerCase()]('S' + kingPos[1] + kingPos[2], piece, board))
      checkingPieces.push(piece); // if a piece is attacking a king
  });
  return checkingPieces.length > 0 ? checkingPieces : false;
}

function movePiecesDiag(destination: string, origin: string, board: string[][]): string[] | boolean {
  const arrayOfAttack: string[] = [];

  if (Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) === 1) return true; // dist = 1

  if (destination[1].charCodeAt(0) - origin[1].charCodeAt(0) > 0) {
    for (let i = 1; i < destination[1].charCodeAt(0) - origin[1].charCodeAt(0); i++) {
      let num;
      parseInt(destination[2]) - parseInt(origin[2]) > 0
        ? (num = parseInt(origin[2]) + i)
        : (num = parseInt(origin[2]) - i);
      let str = String.fromCharCode(origin[1].charCodeAt(0) + i) + num;
      arrayOfAttack.push(str);
      if (board[origin[1].charCodeAt(0) + i - 'a'.charCodeAt(0)][8 - num] !== '1') return false;
    }
  } else {
    for (let i = -1; i > destination[1].charCodeAt(0) - origin[1].charCodeAt(0); i--) {
      let num;
      parseInt(destination[2]) - parseInt(origin[2]) > 0
        ? (num = parseInt(origin[2]) - i)
        : (num = parseInt(origin[2]) + i);
      let str = String.fromCharCode(origin[1].charCodeAt(0) + i) + num;
      arrayOfAttack.push(str);
      if (board[origin[1].charCodeAt(0) + i - 'a'.charCodeAt(0)][8 - num] !== '1') return false;
    }
  }
  return arrayOfAttack;
}

function movePiecesVertLat(destination: string, origin: string, board: string[][]): string[] | boolean {
  const arrayOfAttack: string[] = [];

  // distance = 1 means nothing can be in the way of the move except the destination itself
  if (
    (Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) === 1 && destination[2] === origin[2]) ||
    (Math.abs(parseInt(destination[2]) - parseInt(origin[2])) === 1 &&
      destination[1].charCodeAt(0) === origin[1].charCodeAt(0))
  )
    return true;
  else if (destination[1].charCodeAt(0) > origin[1].charCodeAt(0)) {
    for (let i = 1; i < destination[1].charCodeAt(0) - origin[1].charCodeAt(0); i++) {
      let str = String.fromCharCode(origin[1].charCodeAt(0) + i) + origin[2];
      arrayOfAttack.push(str);

      if (board[origin[1].charCodeAt(0) + i - 'a'.charCodeAt(0)][8 - parseInt(origin[2])] !== '1') return false;
    }
  } else if (destination[1].charCodeAt(0) < origin[1].charCodeAt(0)) {
    for (let i = -1; i > destination[1].charCodeAt(0) - origin[1].charCodeAt(0); i--) {
      let str = String.fromCharCode(origin[1].charCodeAt(0) + i) + origin[2];
      arrayOfAttack.push(str);

      if (board[origin[1].charCodeAt(0) + i - 'a'.charCodeAt(0)][8 - parseInt(origin[2])] !== '1') return false;
    }
  } else {
    // vertical movement
    if (destination[2] > origin[2]) {
      for (let i = 1; i < parseInt(destination[2]) - parseInt(origin[2]); i++) {
        let num = parseInt(origin[2]) + i;
        let str = origin[1] + num;

        arrayOfAttack.push(str);
        if (board[origin[1].charCodeAt(0) - 'a'.charCodeAt(0)][8 - num] !== '1') return false;
      }
    } else if (destination[2] < origin[2]) {
      for (let i = -1; i > parseInt(destination[2]) - parseInt(origin[2]); i--) {
        let num = parseInt(origin[2]) + i;
        let str = origin[1] + num;

        arrayOfAttack.push(str);
        if (board[origin[1].charCodeAt(0) - 'a'.charCodeAt(0)][8 - num] !== '1') return false;
      }
    }
  }
  return arrayOfAttack;
}

export function showPossibleMoves(
  pieceType: string,
  rowIndex: number,
  colIndex: number,
  board: string[][],
  enPassentSquare: string
): number[][] {
  if (pieceType === 'p') return getBlackPawnMoves(rowIndex, colIndex, board, enPassentSquare);
  else if (pieceType === 'P') return getWhitePawnMoves(rowIndex, colIndex, board, enPassentSquare);
  else if (pieceType.toLowerCase() === 'n') return getKnightMoves(rowIndex, colIndex, board);
  else if (pieceType.toLowerCase() === 'q') return getQueenMoves(rowIndex, colIndex, board);
  else if (pieceType.toLowerCase() === 'r') return getVerticalHorizontalMoves(rowIndex, colIndex, board);
  else if (pieceType.toLowerCase() === 'b') return getDiagonalMoves(rowIndex, colIndex, board);
  else if (pieceType.toLowerCase() === 'k') return getKingMoves(rowIndex, colIndex, board);
  return [];
}

function removeDiscoveredChecks(possibleMoves: number[][], rowIndex: number, colIndex: number, board: string[][]) {
  // const board = [['1', '1']];
  // possibleMoves.forEach((move: number[]) => {
  //   board[move[0]][move[1]] = 'p'; // temporary check just to see if the move will resuult in a discovered check
  //   board[rowIndex][colIndex] = '1';
  //   if (isCheck('abc', board)) {
  //   }
  // });
  return possibleMoves;
}
function getKingMoves(rowIndex: number, colIndex: number, board: string[][]) {
  const possibleMoves: number[][] = [];

  return removeDiscoveredChecks(possibleMoves, rowIndex, colIndex, board);
}
function getWhitePawnMoves(rowIndex: number, colIndex: number, board: string[][], enPassentSquare: string) {
  const possibleMoves: number[][] = [];
  // square ahead is free? then add it to the possible moves
  if (rowIndex === 0) return possibleMoves;

  if (board[rowIndex - 1][colIndex] === '1') possibleMoves.push([rowIndex - 1, colIndex]);
  if (rowIndex === 6 && board[rowIndex - 2][colIndex] === '1') possibleMoves.push([rowIndex - 2, colIndex]);

  if (colIndex > 0 && board[rowIndex - 1][colIndex - 1] !== '1' && getColor(board[rowIndex - 1][colIndex - 1]) === 'b')
    possibleMoves.push([rowIndex - 1, colIndex - 1]);
  if (colIndex < 7 && board[rowIndex - 1][colIndex + 1] !== '1' && getColor(board[rowIndex - 1][colIndex + 1]) === 'b')
    possibleMoves.push([rowIndex - 1, colIndex + 1]);

  if (
    enPassentSquare[1] === '5' &&
    rowIndex === 3 &&
    Math.abs(enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0) - colIndex) === 1
  ) {
    possibleMoves.push([rowIndex + 1, enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0)]);
  }

  return removeDiscoveredChecks(possibleMoves, rowIndex, colIndex, board);
}

function getBlackPawnMoves(rowIndex: number, colIndex: number, board: string[][], enPassentSquare: string) {
  const possibleMoves: number[][] = [];
  // square ahead is free? then add it to the possible moves
  if (rowIndex < 7 && board[rowIndex + 1][colIndex] === '1') possibleMoves.push([rowIndex + 1, colIndex]);
  if (rowIndex === 1 && board[rowIndex + 2][colIndex] === '1') possibleMoves.push([rowIndex + 2, colIndex]);

  if (colIndex < 7 && board[rowIndex + 1][colIndex + 1] !== '1' && getColor(board[rowIndex + 1][colIndex + 1]) === 'w')
    possibleMoves.push([rowIndex + 1, colIndex + 1]);
  if (colIndex > 0 && board[rowIndex + 1][colIndex - 1] !== '1' && getColor(board[rowIndex + 1][colIndex - 1]) === 'w')
    possibleMoves.push([rowIndex + 1, colIndex - 1]);

  if (
    enPassentSquare[1] === '3' &&
    rowIndex === 4 &&
    Math.abs(enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0) - colIndex) === 1
  ) {
    possibleMoves.push([rowIndex - 1, enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0)]);
  }

  return removeDiscoveredChecks(possibleMoves, rowIndex, colIndex, board);
}

function getKnightMoves(rowIndex: number, colIndex: number, board: string[][]) {
  const possibleMoves: number[][] = [];
  const color = getColor(board[rowIndex][colIndex]);
  const destinations = [
    [-1, -2],
    [-2, -1],
    [-2, 1],
    [-1, 2],
    [2, -1],
    [1, -2],
    [1, 2],
    [2, 1],
  ]; // all the knight moves

  for (let i = 0; i < 8; i++) {
    const newRowIndex = rowIndex + destinations[i][0];
    const newColIndex = colIndex + destinations[i][1];
    if (newColIndex > 7 || newColIndex < 0 || newRowIndex > 7 || newRowIndex < 0) continue;

    const newSquare = board[newRowIndex][newColIndex];
    if (newSquare === '1' || (newSquare !== '1' && color !== getColor(newSquare))) {
      possibleMoves.push([newRowIndex, newColIndex]);
    }
  }
  return removeDiscoveredChecks(possibleMoves, rowIndex, colIndex, board);
}

function getVerticalHorizontalMoves(rowIndex: number, colIndex: number, board: string[][]) {
  const possibleMoves: number[][] = [];
  const color = getColor(board[rowIndex][colIndex]);
  // vertical
  for (let i = rowIndex - 1; i >= 0; i--) {
    if (board[i][colIndex] === '1') {
      possibleMoves.push([i, colIndex]);
    } else if (board[i][colIndex] !== '1') {
      if (color !== getColor(board[i][colIndex])) possibleMoves.push([i, colIndex]);
      break;
    }
  }
  for (let i = rowIndex + 1; i <= 7; i++) {
    if (board[i][colIndex] === '1') {
      possibleMoves.push([i, colIndex]);
    } else if (board[i][colIndex] !== '1') {
      if (color !== getColor(board[i][colIndex])) possibleMoves.push([i, colIndex]);
      break;
    }
  }
  // horizontal
  for (let i = colIndex - 1; i >= 0; i--) {
    if (board[rowIndex][i] === '1') {
      possibleMoves.push([rowIndex, i]);
    } else if (board[rowIndex][i] !== '1') {
      if (color !== getColor(board[rowIndex][i])) possibleMoves.push([rowIndex, i]);
      break;
    }
  }
  for (let i = colIndex + 1; i <= 7; i++) {
    if (board[rowIndex][i] === '1') {
      possibleMoves.push([rowIndex, i]);
    } else if (board[rowIndex][i] !== '1') {
      if (color !== getColor(board[rowIndex][i])) possibleMoves.push([rowIndex, i]);
      break;
    }
  }
  return removeDiscoveredChecks(possibleMoves, rowIndex, colIndex, board);
}

function getDiagonalMoves(rowIndex: number, colIndex: number, board: string[][]) {
  const possibleMoves: number[][] = [];
  const color = getColor(board[rowIndex][colIndex]);

  let lbDiag, ltDiag, rbDiag, rtDiag;
  lbDiag = ltDiag = rbDiag = rtDiag = true;
  for (let i = 1; i <= colIndex; i++) {
    if (lbDiag && rowIndex + i === 8) lbDiag = false;
    if (ltDiag && rowIndex - i === -1) ltDiag = false;
    if (!lbDiag && !ltDiag) break;

    if (lbDiag) {
      if (board[rowIndex + i][colIndex - i] === '1') possibleMoves.push([rowIndex + i, colIndex - i]);
      else {
        if (color !== getColor(board[rowIndex + i][colIndex - i])) possibleMoves.push([rowIndex + i, colIndex - i]);
        lbDiag = false;
      }
    }
    if (ltDiag) {
      if (board[rowIndex - i][colIndex - i] === '1') possibleMoves.push([rowIndex - i, colIndex - i]);
      else {
        if (color !== getColor(board[rowIndex - i][colIndex - i])) possibleMoves.push([rowIndex - i, colIndex - i]);
        ltDiag = false;
      }
    }
  }

  for (let i = 1; i <= 7 - colIndex; i++) {
    if (rbDiag && rowIndex + i === 8) rbDiag = false;
    if (rtDiag && rowIndex - i === -1) rtDiag = false;
    if (!rbDiag && !rtDiag) break;

    if (rbDiag) {
      if (board[rowIndex + i][colIndex + i] === '1') possibleMoves.push([rowIndex + i, colIndex + i]);
      else {
        if (color !== getColor(board[rowIndex + i][colIndex + i])) possibleMoves.push([rowIndex + i, colIndex + i]);
        rbDiag = false;
      }
    }
    if (rtDiag) {
      if (board[rowIndex - i][colIndex + i] === '1') possibleMoves.push([rowIndex - i, colIndex + i]);
      else {
        if (color !== getColor(board[rowIndex - i][colIndex + i])) possibleMoves.push([rowIndex - i, colIndex + i]);
        rtDiag = false;
      }
    }
  }
  return removeDiscoveredChecks(possibleMoves, rowIndex, colIndex, board);
}

function getQueenMoves(rowIndex: number, colIndex: number, board: string[][]) {
  const possibleMoves: number[][] = getVerticalHorizontalMoves(rowIndex, colIndex, board);
  possibleMoves.push(...getDiagonalMoves(rowIndex, colIndex, board));
  return possibleMoves;
}

export const isAttackingDestination: any = {
  n: function Knight(destination: string, origin: string) {
    if (
      (Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) === 2 &&
        Math.abs(parseInt(destination[2]) - parseInt(origin[2])) === 1) ||
      (Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) === 1 &&
        Math.abs(parseInt(destination[2]) - parseInt(origin[2])) === 2)
    )
      return true;
  },
  b: function Bishop(destination: string, origin: string, board: string[][]) {
    if (
      Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) ===
      Math.abs(parseInt(destination[2]) - parseInt(origin[2]))
    ) {
      if (movePiecesDiag(destination, origin, board)) return true;
    }
  },
  r: function Rook(destination: string, origin: string, board: string[][]) {
    if (destination[1].charCodeAt(0) === origin[1].charCodeAt(0) || destination[2] === origin[2]) {
      if (movePiecesVertLat(destination, origin, board)) return true;
    }
  },
  q: function Queen(destination: string, origin: string, board: string[][]) {
    if (movePiecesVertLat(destination, origin, board)) {
      return true;
    } else if (
      Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) ===
        Math.abs(parseInt(destination[2]) - parseInt(origin[2])) &&
      movePiecesDiag(destination, origin, board)
    )
      return true;
  },
  k: function King(destination: string, origin: string) {
    if (
      (Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) === 1 ||
        Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) === 0) &&
      (Math.abs(parseInt(destination[2]) - parseInt(origin[2])) === 1 ||
        Math.abs(parseInt(destination[2]) - parseInt(origin[2])) === 0)
    )
      return true;
  },
  p: function Pawn(destination: string, origin: string, board: string[][]) {},
};
