export default function findPositionOf(board: string[][], target: string): number[] {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

export function findAllEnemyPieces(board: string[][], enemyColor: string): any[][] {
  const allPieces: any[][] = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece === '1') continue;
      if (getColor(piece) === enemyColor) allPieces.push([i, j]);
    }
  }
  return allPieces;
}

export function getColor(pieceType: string): string {
  if (pieceType.toUpperCase() === pieceType) return 'w';
  else return 'b';
}
