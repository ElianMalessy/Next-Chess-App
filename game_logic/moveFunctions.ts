/* eslint-disable no-loop-func */
import {findAllPieces} from './findBoardIndex';

// only used for determining possible moves if its checkmate after a check
export default function getPossibleMoves(
  checkingPieces: string[],
  kingPos: string,
  piecesArray: string[],
  board: string[]
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
      if (moveFunctions[piece[0]](square, piece[1] + piece[2])) {
        possibleMoves.push([piece, square]);
        console.log(piece, square);
      }
    });
  });
  console.log(possibleMoves, 'possibleMoves');
}

export function isCheck(kingPos: string, piecesArray: string[]) {
  const pieces = findAllPieces(piecesArray, kingPos[0].toLowerCase() === kingPos[0] ? 'b' : 'w'); //select all of the pieces except for the kings as they cant check each other
  // checks if the move is legal by putting in the destination and looking for checks before actually appending to new square
  const potentialCheckingPieces = [...pieces];
  const checkingPieces: string[] = [];
  potentialCheckingPieces.forEach((piece) => {
    if (moveFunctions[piece[0].toLowerCase()]('S' + kingPos[1] + kingPos[2], piece, piecesArray))
      checkingPieces.push(piece); // if a piece is attacking a king
  });
  return checkingPieces.length > 0 ? checkingPieces : false;
}

function movePiecesDiag(destination: string, origin: string, board: string[]): string[] | boolean {
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

function movePiecesVertLat(destination: string, origin: string, board: string[]): string[] | boolean {
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

export function getColor(pieceType: string): string {
  if (pieceType.toUpperCase() === pieceType) return 'w';
  else return 'b';
}

export function highlightSquares(piece: string, enPassentSquare: string) {
  const pieceType = piece[0];
  const position = piece[1] + piece[2];

  switch (pieceType) {
    case 'p':
      return getBlackPawnMoves(position, 'b', enPassentSquare);
    case 'P':
      return getWhitePawnMoves(position, 'w', enPassentSquare);
    case 'n':
      return getKnightMoves(position, 'b');
    case 'N':
      return getKnightMoves(position, 'w');
    case 'q':
      return getQueenMoves(position, 'b');
    case 'Q':
      return getQueenMoves(position, 'w');
    case 'r':
      return getRookMoves(position, 'b');
    case 'R':
      return getRookMoves(position, 'w');
    case 'b':
      return getBishopMoves(position, 'b');
    case 'B':
      return getBishopMoves(position, 'w');
    default:
      break;
  }
}

function getWhitePawnMoves(position: string, color: string, enPassentSquare: string) {
  const possibleMoves = [];
  const positionLetter = position.charCodeAt(0);

  if (!$('#S' + position[0] + (parseInt(position[1]) + 1))[0].firstChild)
    possibleMoves.push(position[0] + (parseInt(position[1]) + 1));
  if (position[1] === '2' && !$('#S' + position[0] + (parseInt(position[1]) + 2))[0].firstChild)
    possibleMoves.push(position[0] + (parseInt(position[1]) + 2));

  let upLeft =
    positionLetter - 1 >= 'a'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter - 1) + (parseInt(position[1]) + 1))
      : null;
  let upRight =
    positionLetter + 1 <= 'h'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter + 1) + (parseInt(position[1]) + 1))
      : null;

  if (upLeft && upLeft[0].firstChild !== null && getColor(upLeft[0].firstChild.id[0]) !== color)
    possibleMoves.push('C' + upLeft[0].id[1] + upLeft[0].id[2]);
  if (upRight && upRight[0].firstChild !== null && getColor(upRight[0].firstChild.id[0]) !== color)
    possibleMoves.push('C' + upRight[0].id[1] + upRight[0].id[2]);

  if (
    enPassentSquare &&
    position[1] === '5' &&
    enPassentSquare[1] === '5' &&
    Math.abs(enPassentSquare.charCodeAt(0) - positionLetter) === 1
  ) {
    possibleMoves.push('E' + enPassentSquare[0] + '4'); // 'E' for enPassent
  }

  return possibleMoves;
}

function getBlackPawnMoves(position: string, color: string, enPassentSquare: string) {
  const possibleMoves = [];
  const positionLetter = position.charCodeAt(0);

  if (!$('#S' + position[0] + (parseInt(position[1]) - 1))[0].firstChild)
    possibleMoves.push(position[0] + (parseInt(position[1]) - 1));
  if (position[1] === '7' && !$('#S' + position[0] + (parseInt(position[1]) - 2))[0].firstChild)
    possibleMoves.push(position[0] + (parseInt(position[1]) - 2));

  let upLeft =
    positionLetter + 1 <= 'h'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter + 1) + (parseInt(position[1]) - 1))
      : null;
  let upRight =
    positionLetter - 1 >= 'a'.charCodeAt(0)
      ? $('#S' + String.fromCharCode(positionLetter - 1) + (parseInt(position[1]) - 1))
      : null;

  if (upLeft && upLeft[0].firstChild !== null && getColor(upLeft[0].firstChild.id[0]) !== color)
    possibleMoves.push('C' + upLeft[0].id[1] + upLeft[0].id[2]);
  if (upRight && upRight[0].firstChild !== null && getColor(upRight[0].firstChild.id[0]) !== color)
    possibleMoves.push('C' + upRight[0].id[1] + upRight[0].id[2]);

  if (
    enPassentSquare &&
    position[1] === '4' &&
    enPassentSquare[1] === '4' &&
    Math.abs(enPassentSquare.charCodeAt(0) - positionLetter) === 1
  ) {
    possibleMoves.push('E' + enPassentSquare[0] + '3'); // 'E' for enPassent
  }

  return possibleMoves;
}

function getKnightMoves(position: string, color: string) {
  const possibleMoves = [];
  const destinations = [
    [-1, 2],
    [1, 2],
    [2, 1],
    [2, -1],
    [1, -2],
    [-1, -2],
    [-2, -1],
    [-2, 1],
  ]; // all the knight moves
  const positionLetter = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);

  for (let i = 0; i < 8; i++) {
    const newLetter = positionLetter + destinations[i][0];
    const newNumber = positionNum + destinations[i][1];
    if (newNumber <= 8 && newNumber > 0 && newLetter >= 'a'.charCodeAt(0) && newLetter <= 'h'.charCodeAt(0)) {
      let square = $('#S' + String.fromCharCode(newLetter) + newNumber);
      if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
      }
      if (!square[0].firstChild) {
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  return possibleMoves;
}

function getVerticalMoves(position: string, color: string) {
  const possibleMoves = [];

  const positionNum = parseInt(position[1]);
  const differenceFromTop = 8 - positionNum;
  const differenceFromBottom = positionNum - 1;

  for (let i = 0; i < differenceFromTop; i++) {
    let square = $('#S' + position[0] + (positionNum + i + 1));

    if (square[0].firstChild) {
      if (color !== getColor(square[0].firstChild.id[0])) {
        possibleMoves.push('C' + square[0].id[1] + square[0].id[2]);
      }
      break;
    } else if (!square[0].firstChild) {
      possibleMoves.push(square[0].id[1] + square[0].id[2]);
    }
  }
  for (let i = 0; i < differenceFromBottom; i++) {
    let square = $('#S' + position[0] + (positionNum - i - 1));
    if (square[0].firstChild) {
      if (color !== getColor(square[0].firstChild.id[0])) {
        possibleMoves.push('C' + square[0].id[1] + square[0].id[2]);
      }
      break;
    } else if (!square[0].firstChild) {
      possibleMoves.push(square[0].id[1] + square[0].id[2]);
    }
  }
  return possibleMoves;
}

function getRookMoves(position, color) {
  const possibleMoves = [];
  possibleMoves.push(...getVerticalMoves(position, color));

  const positionCharCode = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);
  const differenceFromLeft = positionCharCode - 'a'.charCodeAt(0);
  const differenceFromRight = 'h'.charCodeAt(0) - positionCharCode;

  for (let i = 0; i < differenceFromLeft; i++) {
    let square = $('#S' + String.fromCharCode(positionCharCode - i - 1) + positionNum);

    if (square[0].firstChild) {
      if (color !== getColor(square[0].firstChild.id[0])) {
        possibleMoves.push('C' + square[0].id[1] + square[0].id[2]);
      }
      break;
    } else if (!square[0].firstChild) {
      possibleMoves.push(square[0].id[1] + square[0].id[2]);
    }
  }
  for (let i = 0; i < differenceFromRight; i++) {
    let square = $('#S' + String.fromCharCode(positionCharCode + i + 1) + positionNum);

    if (square[0].firstChild) {
      if (color !== getColor(square[0].firstChild.id[0])) {
        possibleMoves.push('C' + square[0].id[1] + square[0].id[2]);
      }
      break;
    } else if (!square[0].firstChild) {
      possibleMoves.push(square[0].id[1] + square[0].id[2]);
    }
  }
  return possibleMoves;
}

function getBishopMoves(position, color) {
  const possibleMoves = [];

  const positionCharCode = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);
  const differenceFromLeft = positionCharCode - 'a'.charCodeAt(0);
  const differenceFromRight = 'h'.charCodeAt(0) - positionCharCode;

  let lbDiag, ltDiag, rbDiag, rtDiag;
  lbDiag = ltDiag = rbDiag = rtDiag = true;
  for (let i = 0; i < differenceFromLeft; i++) {
    // make this into diagonals function so that bishop can use
    // get left horizontal, top left diag, bottom left diag
    let squares = [];
    if (lbDiag && positionNum - i - 1 > 0)
      squares.push([$('#S' + String.fromCharCode(positionCharCode - i - 1) + (positionNum - i - 1))[0], 'lbDiag']);
    if (ltDiag && positionNum + i + 1 <= 8)
      squares.push([$('#S' + String.fromCharCode(positionCharCode - i - 1) + (positionNum + i + 1))[0], 'ltDiag']);
    for (let j = 0; j < squares.length; j++) {
      let square = squares[j];

      if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
        if (square[1] === 'lbDiag') lbDiag = false;
        else if (square[1] === 'ltDiag') ltDiag = false;
      } else if (!square[0].firstChild) {
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  for (let i = 0; i < differenceFromRight; i++) {
    let squares = [];
    if (rbDiag && positionNum - i - 1 > 0)
      squares.push([$('#S' + String.fromCharCode(positionCharCode + i + 1) + (positionNum - i - 1))[0], 'rbDiag']);
    if (rtDiag && positionNum + i + 1 <= 8)
      squares.push([$('#S' + String.fromCharCode(positionCharCode + i + 1) + (positionNum + i + 1))[0], 'rtDiag']);

    for (let j = 0; j < squares.length; j++) {
      let square = squares[j];
      if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
        if (square[1] === 'rbDiag') rbDiag = false;
        else if (square[1] === 'rtDiag') rtDiag = false;
      } else if (!square[0].firstChild) {
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  return possibleMoves;
}

function getQueenMoves(position, color) {
  const possibleMoves = [];
  possibleMoves.push(...getVerticalMoves(position, color));

  const positionCharCode = position.charCodeAt(0);
  const positionNum = parseInt(position[1]);
  const differenceFromLeft = positionCharCode - 'a'.charCodeAt(0);
  const differenceFromRight = 'h'.charCodeAt(0) - positionCharCode;

  let lbDiag, lMid, ltDiag, rbDiag, rMid, rtDiag;
  lbDiag = lMid = ltDiag = rbDiag = rMid = rtDiag = true;

  for (let i = 0; i < differenceFromLeft; i++) {
    // make this into diagonals function so that bishop can use
    // get left horizontal, top left diag, bottom left diag
    let squares = [];
    if (lbDiag && positionNum - i - 1 > 0)
      squares.push([$('#S' + String.fromCharCode(positionCharCode - i - 1) + (positionNum - i - 1))[0], 'lbDiag']);
    if (lMid) squares.push([$('#S' + String.fromCharCode(positionCharCode - i - 1) + positionNum)[0], 'lMid']);
    if (ltDiag && positionNum + i + 1 <= 8)
      squares.push([$('#S' + String.fromCharCode(positionCharCode - i - 1) + (positionNum + i + 1))[0], 'ltDiag']);
    for (let j = 0; j < squares.length; j++) {
      let square = squares[j];

      if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
        if (square[1] === 'lbDiag') lbDiag = false;
        else if (square[1] === 'lMid') lMid = false;
        else if (square[1] === 'ltDiag') ltDiag = false;
      } else if (!square[0].firstChild) {
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  for (let i = 0; i < differenceFromRight; i++) {
    let squares = [];
    if (rbDiag && positionNum - i - 1 > 0)
      squares.push([$('#S' + String.fromCharCode(positionCharCode + i + 1) + (positionNum - i - 1))[0], 'rbDiag']);
    if (rMid) squares.push([$('#S' + String.fromCharCode(positionCharCode + i + 1) + positionNum)[0], 'rMid']);
    if (rtDiag && positionNum + i + 1 <= 8)
      squares.push([$('#S' + String.fromCharCode(positionCharCode + i + 1) + (positionNum + i + 1))[0], 'rtDiag']);

    for (let j = 0; j < squares.length; j++) {
      let square = squares[j];
      if (square[0].firstChild) {
        if (color !== getColor(square[0].firstChild.id[0])) {
          possibleMoves.push('C' + square[0].id[1] + square[0].id[2]); // 'C' for captureHint
        }
        if (square[1] === 'rbDiag') rbDiag = false;
        else if (square[1] === 'rMid') rMid = false;
        else if (square[1] === 'rtDiag') rtDiag = false;
      } else if (!square[0].firstChild) {
        possibleMoves.push(square[0].id[1] + square[0].id[2]);
      }
    }
  }
  return possibleMoves;
}

export const moveFunctions: any = {
  n: function Knight(destination: string, origin: string) {
    if (
      (Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) === 2 &&
        Math.abs(parseInt(destination[2]) - parseInt(origin[2])) === 1) ||
      (Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) === 1 &&
        Math.abs(parseInt(destination[2]) - parseInt(origin[2])) === 2)
    )
      return true;
  },
  b: function Bishop(destination: string, origin: string, board: string) {
    if (
      Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) ===
      Math.abs(parseInt(destination[2]) - parseInt(origin[2]))
    ) {
      if (movePiecesDiag(destination, origin, board)) return true;
    }
  },
  r: function Rook(destination: string, origin: string, board: string) {
    if (destination[1].charCodeAt(0) === origin[1].charCodeAt(0) || destination[2] === origin[2]) {
      if (movePiecesVertLat(destination, origin, board)) return true;
    }
  },
  q: function Queen(destination: string, origin: string, board: string) {
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
  p: function Pawn(destination: string, origin: string, board: string) {
    let pawn = $('#' + origin);
    let pawnColor = pawn.attr('color');

    if (Math.abs(destination[1].charCodeAt(0) - origin[1].charCodeAt(0)) === 1) {
      //let enPassent_sqaure;
      //FEN[1] === '-' ? (enPassent_sqaure = null) : (enPassent_sqaure = FEN);
      let attemptedEnPassent_sqaure;
      if (
        $('#' + destination)[0].firstChild !== null &&
        Math.abs(parseInt(destination[2]) - parseInt(origin[2])) === 1
      ) {
        return true;
      } else if (pawnColor === 'white') {
        attemptedEnPassent_sqaure = $('#S' + destination[1] + (parseInt(destination[2]) - 1));
        //console.log(enPassent_sqaure, attemptedEnPassent_sqaure);
      } else if (pawnColor === 'black') {
        attemptedEnPassent_sqaure = $('#S' + destination[1] + (parseInt(destination[2]) + 1));
        //console.log(enPassent_sqaure, attemptedEnPassent_sqaure);
      }
      if (attemptedEnPassent_sqaure) {
        //console.log(attemptedEnPassent_sqaure.children());
      }
    } else if (destination[1].charCodeAt(0) - origin[1].charCodeAt(0) === 0 && pawnColor === 'white') {
      if (
        parseInt(destination[2]) - parseInt(origin[2]) === 2 ||
        parseInt(destination[2]) - parseInt(origin[2]) === 1
      ) {
        return 'p';
      }
    } else if (destination[1].charCodeAt(0) - origin[1].charCodeAt(0) === 0 && pawnColor === 'black') {
      if (
        parseInt(destination[2]) - parseInt(origin[2]) === -2 ||
        parseInt(destination[2]) - parseInt(origin[2]) === -1
      ) {
        return 'p';
      }
    }
  },
};
