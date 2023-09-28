import findPositionOf, {findAllPieces, getColor} from './utilityFunctions';

export default function isCheckmate(board: string[][], playerColor: string, enPassent: string): boolean | string {
  // if there are checking pieces, then that means that the move that this player makes has to block those checking pieces
  // use isCheck on all of the possibilities, if its a bishop for example, that means that the move either has to be the king moving out of the way
  // (that can be true for all of them, as long as that next position doesnt return a true in isCheck()), or it can be a piece moving into that diag
  // if there are no possible moves to stop isCheck() as in it always returns true, then it is checkmate and the game ends
  const otherKingPosition = findPositionOf(board, playerColor === 'w' ? 'k' : 'K');
  const enemyPieces = findAllPieces(board, playerColor);
  const friendlyPieces = findAllPieces(board, playerColor === 'w' ? 'b' : 'w');

  const tempPossibleSquares: number[][] = [];
  const checkingPieces: number[][] = [];
  enemyPieces.forEach((potentialCheckingPiece) => {
    const arrayOfAttack = arrayOfAttackOnDestination[
      board[potentialCheckingPiece[0]][potentialCheckingPiece[1]].toLowerCase()
    ](otherKingPosition, [potentialCheckingPiece[0], potentialCheckingPiece[1]], board, enPassent);
    if (arrayOfAttack) {
      if (arrayOfAttack.length > 0) {
        tempPossibleSquares.push(...arrayOfAttack);
      }
      tempPossibleSquares.push([potentialCheckingPiece[0], potentialCheckingPiece[1]]);
      checkingPieces.push([potentialCheckingPiece[0], potentialCheckingPiece[1]]);
    }
  });
  if (checkingPieces.length === 0) return false; // no checks found

  const kingMoves = getKingMoves(otherKingPosition[0], otherKingPosition[1], board, '', enPassent);
  if (kingMoves && kingMoves.length > 0) return 'check';
  for (let i = 0; i < friendlyPieces.length; i++) {
    // with the possible squares where pieces must go to protect the king, check every friendly piece and see if they can go to said squares
    // if a piece going to this square triggers a discovered check, its not a possible move
    for (let j = 0; j < tempPossibleSquares.length; j++) {
      const arrayOfAttack = arrayOfAttackOnDestination[board[friendlyPieces[i][0]][friendlyPieces[i][1]].toLowerCase()](
        tempPossibleSquares[j],
        [friendlyPieces[i][0], friendlyPieces[i][1]],
        board,
        enPassent
      );
      // if piece can go there AND it doesn't trigger a discovered check
      if (arrayOfAttack) {
        const move = enPassent !== '-' && arrayOfAttack.length > 0 ? arrayOfAttack[0] : tempPossibleSquares[j];
        const piece = board[friendlyPieces[i][0]][friendlyPieces[i][1]];
        const square = board[move[0]][move[1]];

        board[friendlyPieces[i][0]][friendlyPieces[i][1]] = '1';
        board[move[0]][move[1]] = piece;

        let temp = '1';
        if (enPassent !== '-' && arrayOfAttack.length > 0) {
          temp = board[tempPossibleSquares[j][0]][tempPossibleSquares[j][1]];
          board[tempPossibleSquares[j][0]][tempPossibleSquares[j][1]] = '1';
        }

        if (
          !isCheck(
            JSON.parse(JSON.stringify(board)),
            findPositionOf(board, playerColor === 'w' ? 'k' : 'K'),
            findAllPieces(JSON.parse(JSON.stringify(board)), playerColor),
            enPassent
          )
        ) {
          board[move[0]][move[1]] = square;
          board[friendlyPieces[i][0]][friendlyPieces[i][1]] = piece;
          if (enPassent !== '-' && arrayOfAttack.length > 0)
            board[tempPossibleSquares[j][0]][tempPossibleSquares[j][1]] = temp;
          return 'check';
        }

        board[move[0]][move[1]] = square;
        board[friendlyPieces[i][0]][friendlyPieces[i][1]] = piece;
        if (enPassent !== '-' && arrayOfAttack.length > 0)
          board[tempPossibleSquares[j][0]][tempPossibleSquares[j][1]] = temp;
      }
    }
  }
  return true;
}

function isCheck(board: string[][], kingPosition: number[], potentialCheckingPieces: number[][], enPassent: string) {
  for (let i = 0; i < potentialCheckingPieces.length; i++) {
    if (
      arrayOfAttackOnDestination[board[potentialCheckingPieces[i][0]][potentialCheckingPieces[i][1]].toLowerCase()](
        kingPosition,
        potentialCheckingPieces[i],
        board,
        enPassent
      )
    ) {
      return true;
    }
  }
  return false;
}

export function isStalemate(board: string[][], playerColor: string, enPassent: string) {
  const enemyPieces = findAllPieces(board, playerColor);
  for (let i = 0; i < enemyPieces.length; i++) {
    if (
      showPossibleMoves(
        board[enemyPieces[i][0]][enemyPieces[i][1]].toLowerCase(),
        enemyPieces[i][0],
        enemyPieces[i][1],
        board,
        enPassent,
        ''
      ).length > 0
    )
      return false;
  }
  return true;
}

function movePiecesDiag(destination: number[], origin: number[], board: string[][]): number[][] | boolean {
  const arrayOfAttack: number[][] = [];

  if (Math.abs(destination[0] - origin[0]) === 1) {
    return arrayOfAttack;
  } // dist = 1

  if (destination[0] - origin[0] > 0) {
    for (let i = 1; i < destination[0] - origin[0]; i++) {
      const num = destination[1] - origin[1] > 0 ? origin[1] + i : origin[1] - i;
      arrayOfAttack.push([origin[0] + i, num]);
      if (board[origin[0] + i][num] !== '1') return false;
    }
  } else {
    for (let i = -1; i > destination[0] - origin[0]; i--) {
      const num = destination[1] - origin[1] > 0 ? origin[1] - i : origin[1] + i;
      arrayOfAttack.push([origin[0] + i, num]);
      if (board[origin[0] + i][num] !== '1') return false;
    }
  }
  return arrayOfAttack;
}

function movePiecesVertLat(destination: number[], origin: number[], board: string[][]): number[][] | boolean {
  const arrayOfAttack: number[][] = [];
  if (destination[0] !== origin[0] && destination[1] !== origin[1])
    return false; // cant move both vert and lat at the same time
  else if (
    (Math.abs(destination[0] - origin[0]) === 1 && destination[1] === origin[1]) ||
    (Math.abs(destination[1] - origin[1]) === 1 && destination[0] === origin[0])
  ) {
    return arrayOfAttack; // distance = 1 means nothing can be in the way of the move except the destination itself
  }
  // vertical movement
  if (Math.abs(destination[0] - origin[0]) > 0) {
    for (let i = 1, j = -1; i < Math.abs(destination[0] - origin[0]); i++, j--) {
      const index = destination[0] > origin[0] ? i : j;
      if (board[origin[0] + index][origin[1]] !== '1') return false;
      arrayOfAttack.push([origin[0] + index, origin[1]]);
    }
  }
  // horizontal movement
  else if (Math.abs(destination[1] - origin[1]) > 0) {
    for (let i = 1, j = -1; i < Math.abs(destination[1] - origin[1]); i++, j--) {
      const index = destination[1] > origin[1] ? i : j;
      if (board[origin[0]][origin[1] + index] !== '1') return false;
      arrayOfAttack.push([origin[0], origin[1] + index]);
    }
  }
  return arrayOfAttack;
}

export function showPossibleMoves(
  pieceType: string,
  row: number,
  col: number,
  board: string[][],
  enPassent: string,
  castling: string
): number[][] {
  if (pieceType === 'p') return getBlackPawnMoves(row, col, board, enPassent);
  else if (pieceType === 'P') return getWhitePawnMoves(row, col, board, enPassent);
  else if (pieceType.toLowerCase() === 'n') return getKnightMoves(row, col, board, enPassent);
  else if (pieceType.toLowerCase() === 'q') return getQueenMoves(row, col, board, enPassent);
  else if (pieceType.toLowerCase() === 'r') return getVerticalHorizontalMoves(row, col, board, enPassent);
  else if (pieceType.toLowerCase() === 'b') return getDiagonalMoves(row, col, board, enPassent);
  else if (pieceType.toLowerCase() === 'k') return getKingMoves(row, col, board, castling, enPassent);
  return [];
}

function removeDiscoveredChecks(
  tempPossibleMoves: number[][],
  row: number,
  col: number,
  board: string[][],
  playerColor: string,
  enPassent: string
) {
  const possibleMoves: number[][] = [];

  const piece = board[row][col];
  let kingPosition = findPositionOf(JSON.parse(JSON.stringify(board)), playerColor === 'w' ? 'K' : 'k');

  for (let i = 0; i < tempPossibleMoves.length; i++) {
    const move = tempPossibleMoves[i];
    const temp = board[move[0]][move[1]];
    board[move[0]][move[1]] = piece;
    board[row][col] = '1';
    if (tempPossibleMoves[i].length === 3) board[tempPossibleMoves[i][2]][tempPossibleMoves[i][1]] = '1';

    if (piece.toLowerCase() === 'k')
      kingPosition = findPositionOf(JSON.parse(JSON.stringify(board)), playerColor === 'w' ? 'K' : 'k');

    // castling
    if (piece.toLowerCase() === 'k' && Math.abs(tempPossibleMoves[i][1] - col) > 1) {
      const enemyPieces = findAllPieces(JSON.parse(JSON.stringify(board)), playerColor === 'w' ? 'b' : 'w');
      for (let j = 1; j <= Math.abs(tempPossibleMoves[i][1] - col); j++) {
        const newKingCol = tempPossibleMoves[i][1] - col > 0 ? col + j : col - j;
        board[row][newKingCol] = piece;
        if (isCheck(JSON.parse(JSON.stringify(board)), [row, newKingCol], enemyPieces, enPassent)) {
          board[row][newKingCol] = '1';
          break;
        }
        board[row][newKingCol] = '1';
        if (newKingCol === Math.abs(tempPossibleMoves[i][1] - col)) {
          possibleMoves.push(move);
          board[row][col] = piece;
          continue;
        }
      }
    } else if (
      !isCheck(
        JSON.parse(JSON.stringify(board)),
        kingPosition,
        findAllPieces(JSON.parse(JSON.stringify(board)), playerColor === 'w' ? 'b' : 'w'),
        enPassent
      )
    )
      possibleMoves.push(move);

    board[row][col] = piece;
    board[move[0]][move[1]] = temp;
    if (tempPossibleMoves[i].length === 3)
      board[tempPossibleMoves[i][2]][tempPossibleMoves[i][1]] = piece === 'P' ? 'p' : 'P';
  }
  return possibleMoves;
}

function getKingMoves(row: number, col: number, board: string[][], castling: string, enPassent: string) {
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
  if (isCheck(board, [row, col], findAllPieces(board, color === 'b' ? 'w' : 'b'), enPassent))
    return removeDiscoveredChecks(possibleMoves, row, col, board, color, enPassent); // can't castle into a check / go through a check when castling

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

  return removeDiscoveredChecks(possibleMoves, row, col, board, color, enPassent);
}
function getWhitePawnMoves(row: number, col: number, board: string[][], enPassent: string) {
  const possibleMoves: number[][] = [];
  if (row === 0) return possibleMoves;

  if (row > 0 && board[row - 1][col] === '1') {
    possibleMoves.push([row - 1, col]);
    if (row === 6 && board[row - 2][col] === '1') possibleMoves.push([row - 2, col, row - 1, col]); // setEnPassent Square
  }

  if (col > 0 && board[row - 1][col - 1] !== '1' && getColor(board[row - 1][col - 1]) === 'b')
    possibleMoves.push([row - 1, col - 1]);
  if (col < 7 && board[row - 1][col + 1] !== '1' && getColor(board[row - 1][col + 1]) === 'b')
    possibleMoves.push([row - 1, col + 1]);

  if (row === 3 && enPassent[1] === '6' && Math.abs(enPassent.charCodeAt(0) - 'a'.charCodeAt(0) - col) === 1) {
    possibleMoves.push([row - 1, enPassent.charCodeAt(0) - 'a'.charCodeAt(0), row]);
  }
  return removeDiscoveredChecks(possibleMoves, row, col, board, 'w', enPassent);
}

function getBlackPawnMoves(row: number, col: number, board: string[][], enPassent: string) {
  const possibleMoves: number[][] = [];
  if (row < 7 && board[row + 1][col] === '1') {
    possibleMoves.push([row + 1, col]);
    if (row === 1 && board[row + 2][col] === '1') possibleMoves.push([row + 2, col, row + 1, col]); // setEnPassent Square
  }

  if (col < 7 && board[row + 1][col + 1] !== '1' && getColor(board[row + 1][col + 1]) === 'w')
    possibleMoves.push([row + 1, col + 1]);
  if (col > 0 && board[row + 1][col - 1] !== '1' && getColor(board[row + 1][col - 1]) === 'w')
    possibleMoves.push([row + 1, col - 1]);
  if (row === 4 && enPassent[1] === '3' && Math.abs(enPassent.charCodeAt(0) - 'a'.charCodeAt(0) - col) === 1) {
    possibleMoves.push([row + 1, enPassent.charCodeAt(0) - 'a'.charCodeAt(0), row]);
  }
  return removeDiscoveredChecks(possibleMoves, row, col, board, 'b', enPassent);
}

function getKnightMoves(row: number, col: number, board: string[][], enPassent: string) {
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
  return removeDiscoveredChecks(possibleMoves, row, col, board, color, enPassent);
}

function getVerticalHorizontalMoves(row: number, col: number, board: string[][], enPassent: string) {
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
  return removeDiscoveredChecks(possibleMoves, row, col, board, color, enPassent);
}

function getDiagonalMoves(row: number, col: number, board: string[][], enPassent: string) {
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
  return removeDiscoveredChecks(possibleMoves, row, col, board, color, enPassent);
}

function getQueenMoves(row: number, col: number, board: string[][], enPassent: string) {
  const possibleMoves: number[][] = getVerticalHorizontalMoves(row, col, board, enPassent);
  possibleMoves.push(...getDiagonalMoves(row, col, board, enPassent));
  return possibleMoves;
}

export const arrayOfAttackOnDestination: any = {
  n: function Knight(destination: number[], origin: number[]) {
    if (
      (Math.abs(destination[0] - origin[0]) === 2 && Math.abs(destination[1] - origin[1]) === 1) ||
      (Math.abs(destination[0] - origin[0]) === 1 && Math.abs(destination[1] - origin[1]) === 2)
    )
      return [];
  },
  b: function Bishop(destination: number[], origin: number[], board: string[][]) {
    if (Math.abs(destination[0] - origin[0]) === Math.abs(destination[1] - origin[1])) {
      return movePiecesDiag(destination, origin, board);
    }
  },
  r: function Rook(destination: number[], origin: number[], board: string[][]) {
    if (destination[0] === origin[0] || destination[1] === origin[1]) {
      return movePiecesVertLat(destination, origin, board);
    }
  },
  q: function Queen(destination: number[], origin: number[], board: string[][]) {
    if (
      (Math.abs(destination[0] - origin[0]) > 0 && destination[1] === origin[1]) ||
      (Math.abs(destination[1] - origin[1]) > 0 && destination[0] === origin[0])
    )
      return movePiecesVertLat(destination, origin, board);
    else if (Math.abs(destination[0] - origin[0]) === Math.abs(destination[1] - origin[1]))
      return movePiecesDiag(destination, origin, board);
  },
  k: function King(destination: number[], origin: number[]) {
    if (
      (Math.abs(destination[0] - origin[0]) === 1 || Math.abs(destination[0] - origin[0]) === 0) &&
      (Math.abs(destination[1] - origin[1]) === 1 || Math.abs(destination[1] - origin[1]) === 0)
    )
      return [];
  },
  p: function Pawn(destination: number[], origin: number[], board: string[][], enPassent: string) {
    const color = getColor(board[origin[0]][origin[1]]);
    let ret = false;
    const enPassentCol = enPassent.charCodeAt(0) - 'a'.charCodeAt(0);
    const enPassentRow = 8 - parseInt(enPassent[1]);

    if (
      enPassent &&
      enPassent !== '-' &&
      Math.abs(enPassentCol - origin[1]) === 1 &&
      getColor(board[destination[0]][destination[1]]) !== color
    ) {
      if (color === 'w' && enPassentRow - origin[0] === -1 && enPassentRow - destination[0] === -1)
        return [[enPassentRow, enPassentCol]];
      else if (color === 'b' && enPassentRow - origin[0] === 1 && enPassentRow - destination[0] === 1)
        return [[enPassentRow, enPassentCol]];
    } // enPassent

    if (board[destination[0]][destination[1]] === '1' && destination[1] - origin[1] === 0) ret = true;
    else if (
      board[destination[0]][destination[1]] !== '1' &&
      Math.abs(destination[1] - origin[1]) === 1 &&
      color !== getColor(board[destination[0]][destination[1]])
    )
      ret = true;

    if (ret && color === 'w' && destination[0] - origin[0] === -1) return [];
    else if (ret && color === 'b' && destination[0] - origin[0] === 1) return [];

    return false;
  },
};
