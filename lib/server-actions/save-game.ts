import { doc, setDoc, serverTimestamp } from '@firebase/firestore';
import { firestore } from '@/components/firebase';

export interface GameResult {
  gameId: string;
  player1: string;
  player2: string;
  winner: string;
  result: 'checkmate' | 'stalemate' | 'resignation' | 'draw';
  finalFEN: string;
  participants: string[];
}

export async function saveCompletedGame(gameResult: GameResult) {
  try {
    const gameRef = doc(firestore, 'completedGames', gameResult.gameId);
    await setDoc(gameRef, {
      ...gameResult,
      startedAt: serverTimestamp(),
      endedAt: serverTimestamp(),
    });
    console.log('Game saved successfully');
  } catch (error) {
    console.error('Error saving completed game:', error);
  }
}