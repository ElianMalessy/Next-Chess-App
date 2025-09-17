'use client';
import { useEffect } from 'react';
import { useEndStateStore } from '@/lib/hooks/useStateStore';
import { saveCompletedGame } from '@/lib/server-actions/save-game';

export function useGameEndDetection(gameId: string, player1: string, player2: string, currentFEN: string) {
  const { checkmate, stalemate } = useEndStateStore();

  useEffect(() => {
    if (!gameId || !player1 || !player2) return;

    const saveGame = async () => {
      let result: 'checkmate' | 'stalemate' | 'resignation' | 'draw';
      let winner = '';

      if (checkmate) {
        result = 'checkmate';
        // The current player lost (since it's their turn and they're in checkmate)
        // We'd need more context to determine the actual winner
        winner = player1; // This would need proper logic based on whose turn it is
      } else if (stalemate) {
        result = 'stalemate';
        winner = ''; // No winner in stalemate
      } else {
        return; // Game hasn't ended yet
      }

      await saveCompletedGame({
        gameId,
        player1,
        player2,
        winner,
        result,
        finalFEN: currentFEN,
        participants: [player1, player2].filter(Boolean),
      });
    };

    if (checkmate || stalemate) {
      saveGame();
    }
  }, [checkmate, stalemate, gameId, player1, player2, currentFEN]);
}