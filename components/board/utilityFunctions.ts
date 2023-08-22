export default function findPositionOf(arrayofArray: string[][], target: string) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (arrayofArray[i][j] === target) {
        return target + String.fromCharCode('a'.charCodeAt(0) + j) + (8 - i);
        // e.g, i = 0 and j = 0 means a8 i = 3 and j = 2 means c5
      }
    }
  }
  return false;
}

export function findAllEnemyPieces(arrayofArray: string[][], color: string) {
  const allPieces: string[] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let piece = arrayofArray[i][j];
      if (piece.toLowerCase() === 'k' || piece === '1') continue;
      if (getColor(piece) === color) allPieces.push(piece + String.fromCharCode('a'.charCodeAt(0) + j) + (8 - i));
    }
  }
  //console.log(allPieces);
  return allPieces;
}

export function getColor(pieceType: string): string {
  if (pieceType.toUpperCase() === pieceType) return 'w';
  else return 'b';
}
