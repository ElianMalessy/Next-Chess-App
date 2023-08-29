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
  row: number,
  col: number,
  board: string[][],
  enPassentSquare: string,
  castling: string
): number[][] {
  if (pieceType === 'p') return getBlackPawnMoves(row, col, board, enPassentSquare);
  else if (pieceType === 'P') return getWhitePawnMoves(row, col, board, enPassentSquare);
  else if (pieceType.toLowerCase() === 'n') return getKnightMoves(row, col, board);
  else if (pieceType.toLowerCase() === 'q') return getQueenMoves(row, col, board);
  else if (pieceType.toLowerCase() === 'r') return getVerticalHorizontalMoves(row, col, board);
  else if (pieceType.toLowerCase() === 'b') return getDiagonalMoves(row, col, board);
  else if (pieceType.toLowerCase() === 'k') return getKingMoves(row, col, board, castling);
  return [];
}

function removeDiscoveredChecks(possibleMoves: number[][], row: number, col: number, board: string[][]) {
  // const board = [['1', '1']];
  // possibleMoves.forEach((move: number[]) => {
  //   board[move[0]][move[1]] = 'p'; // temporary check just to see if the move will result in a discovered check
  //   board[row][col] = '1';
  //   if (isCheck('abc', board)) {
  //   }
  // });
  return possibleMoves;
}
function getKingMoves(row: number, col: number, board: string[][], castling: string) {
  const possibleMoves: number[][] = [];
  const color = getColor(board[row][col]);
  const destinations = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 0],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ]; // all the king individual moves

  for (let i = 0; i < 9; i++) {
    const newRow = row + destinations[i][0];
    const newCol = col + destinations[i][1];
    if (newCol > 7 || newCol < 0 || newRow > 7 || newRow < 0) continue;

    const newSquare = board[newRow][newCol];
    if (newSquare === '1' || (newSquare !== '1' && color !== getColor(newSquare))) {
      possibleMoves.push([newRow, newCol]);
    }
  }
  if (
    ((color === 'w' && castling.includes('K')) || (color === 'b' && castling.includes('k'))) &&
    board[row][col + 1] === '1' &&
    board[row][col + 2] === '1'
  )
    possibleMoves.push([row, col + 2, col + 1, 7]);
  if (
    ((color === 'w' && castling.includes('Q')) || (color === 'b' && castling.includes('q'))) &&
    board[row][col - 1] === '1' &&
    board[row][col - 2] === '1' &&
    board[row][col - 3] === '1'
  )
    possibleMoves.push([row, col - 2, col - 1, 0]);

  return removeDiscoveredChecks(possibleMoves, row, col, board);
}
function getWhitePawnMoves(row: number, col: number, board: string[][], enPassentSquare: string) {
  const possibleMoves: number[][] = [];
  if (row === 0) return possibleMoves;

  if (board[row - 1][col] === '1') possibleMoves.push([row - 1, col]);
  if (row === 6 && board[row - 2][col] === '1') possibleMoves.push([row - 2, col, row - 1, col]); // setEnPassent Square

  if (col > 0 && board[row - 1][col - 1] !== '1' && getColor(board[row - 1][col - 1]) === 'b')
    possibleMoves.push([row - 1, col - 1]);
  if (col < 7 && board[row - 1][col + 1] !== '1' && getColor(board[row - 1][col + 1]) === 'b')
    possibleMoves.push([row - 1, col + 1]);

  if (
    row === 3 &&
    enPassentSquare[1] === '6' &&
    Math.abs(enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0) - col) === 1
  ) {
    possibleMoves.push([row - 1, enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0), row]);
  }

  return removeDiscoveredChecks(possibleMoves, row, col, board);
}

function getBlackPawnMoves(row: number, col: number, board: string[][], enPassentSquare: string) {
  const possibleMoves: number[][] = [];
  if (row < 7 && board[row + 1][col] === '1') possibleMoves.push([row + 1, col]);
  if (row === 1 && board[row + 2][col] === '1') possibleMoves.push([row + 2, col, row + 1, col]); // setEnPassent Square

  if (col < 7 && board[row + 1][col + 1] !== '1' && getColor(board[row + 1][col + 1]) === 'w')
    possibleMoves.push([row + 1, col + 1]);
  if (col > 0 && board[row + 1][col - 1] !== '1' && getColor(board[row + 1][col - 1]) === 'w')
    possibleMoves.push([row + 1, col - 1]);
  console.log(row, enPassentSquare);
  if (
    row === 4 &&
    enPassentSquare[1] === '3' &&
    Math.abs(enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0) - col) === 1
  ) {
    possibleMoves.push([row + 1, enPassentSquare.charCodeAt(0) - 'a'.charCodeAt(0), row]);
  }

  return removeDiscoveredChecks(possibleMoves, row, col, board);
}

function getKnightMoves(row: number, col: number, board: string[][]) {
  const possibleMoves: number[][] = [];
  const color = getColor(board[row][col]);
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
    const newRow = row + destinations[i][0];
    const newCol = col + destinations[i][1];
    if (newCol > 7 || newCol < 0 || newRow > 7 || newRow < 0) continue;

    const newSquare = board[newRow][newCol];
    if (newSquare === '1' || (newSquare !== '1' && color !== getColor(newSquare))) {
      possibleMoves.push([newRow, newCol]);
    }
  }
  return removeDiscoveredChecks(possibleMoves, row, col, board);
}

function getVerticalHorizontalMoves(row: number, col: number, board: string[][]) {
  const possibleMoves: number[][] = [];
  const color = getColor(board[row][col]);
  // vertical
  for (let i = row - 1; i >= 0; i--) {
    if (board[i][col] === '1') {
      possibleMoves.push([i, col]);
    } else if (board[i][col] !== '1') {
      if (color !== getColor(board[i][col])) possibleMoves.push([i, col]);
      break;
    }
  }
  for (let i = row + 1; i <= 7; i++) {
    if (board[i][col] === '1') {
      possibleMoves.push([i, col]);
    } else if (board[i][col] !== '1') {
      if (color !== getColor(board[i][col])) possibleMoves.push([i, col]);
      break;
    }
  }
  // horizontal
  for (let i = col - 1; i >= 0; i--) {
    if (board[row][i] === '1') {
      possibleMoves.push([row, i]);
    } else if (board[row][i] !== '1') {
      if (color !== getColor(board[row][i])) possibleMoves.push([row, i]);
      break;
    }
  }
  for (let i = col + 1; i <= 7; i++) {
    if (board[row][i] === '1') {
      possibleMoves.push([row, i]);
    } else if (board[row][i] !== '1') {
      if (color !== getColor(board[row][i])) possibleMoves.push([row, i]);
      break;
    }
  }
  return removeDiscoveredChecks(possibleMoves, row, col, board);
}

function getDiagonalMoves(row: number, col: number, board: string[][]) {
  const possibleMoves: number[][] = [];
  const color = getColor(board[row][col]);

  let lbDiag, ltDiag, rbDiag, rtDiag;
  lbDiag = ltDiag = rbDiag = rtDiag = true;
  for (let i = 1; i <= col; i++) {
    if (lbDiag && row + i === 8) lbDiag = false;
    if (ltDiag && row - i === -1) ltDiag = false;
    if (!lbDiag && !ltDiag) break;

    if (lbDiag) {
      if (board[row + i][col - i] === '1') possibleMoves.push([row + i, col - i]);
      else {
        if (color !== getColor(board[row + i][col - i])) possibleMoves.push([row + i, col - i]);
        lbDiag = false;
      }
    }
    if (ltDiag) {
      if (board[row - i][col - i] === '1') possibleMoves.push([row - i, col - i]);
      else {
        if (color !== getColor(board[row - i][col - i])) possibleMoves.push([row - i, col - i]);
        ltDiag = false;
      }
    }
  }

  for (let i = 1; i <= 7 - col; i++) {
    if (rbDiag && row + i === 8) rbDiag = false;
    if (rtDiag && row - i === -1) rtDiag = false;
    if (!rbDiag && !rtDiag) break;

    if (rbDiag) {
      if (board[row + i][col + i] === '1') possibleMoves.push([row + i, col + i]);
      else {
        if (color !== getColor(board[row + i][col + i])) possibleMoves.push([row + i, col + i]);
        rbDiag = false;
      }
    }
    if (rtDiag) {
      if (board[row - i][col + i] === '1') possibleMoves.push([row - i, col + i]);
      else {
        if (color !== getColor(board[row - i][col + i])) possibleMoves.push([row - i, col + i]);
        rtDiag = false;
      }
    }
  }
  return removeDiscoveredChecks(possibleMoves, row, col, board);
}

function getQueenMoves(row: number, col: number, board: string[][]) {
  const possibleMoves: number[][] = getVerticalHorizontalMoves(row, col, board);
  possibleMoves.push(...getDiagonalMoves(row, col, board));
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
