'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/hooks/useAuthStore';
import { collection, query, where, orderBy, getDocs, limit } from '@firebase/firestore';
import { firestore } from '@/components/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface GameRecord {
  id: string;
  player1: string;
  player2: string;
  winner: string;
  result: 'checkmate' | 'stalemate' | 'resignation' | 'draw';
  endedAt: any;
  startedAt: any;
  finalFEN: string;
}

export default function PreviousGamesList() {
  const { currentUser } = useAuthStore();
  const [games, setGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    const fetchGames = async () => {
      try {
        const gamesRef = collection(firestore, 'completedGames');
        const q = query(
          gamesRef,
          where('participants', 'array-contains', currentUser.uid),
          orderBy('endedAt', 'desc'),
          limit(50)
        );
        
        const querySnapshot = await getDocs(q);
        const gameRecords: GameRecord[] = [];
        
        querySnapshot.forEach((doc) => {
          gameRecords.push({
            id: doc.id,
            ...doc.data()
          } as GameRecord);
        });
        
        setGames(gameRecords);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [currentUser]);

  const getResultBadgeColor = (result: string, winner: string, userId: string) => {
    if (result === 'stalemate' || result === 'draw') return 'secondary';
    if (winner === userId) return 'default';
    return 'destructive';
  };

  const getResultText = (result: string, winner: string, userId: string) => {
    if (result === 'stalemate') return 'Stalemate';
    if (result === 'draw') return 'Draw';
    if (result === 'resignation') {
      return winner === userId ? 'Won by Resignation' : 'Lost by Resignation';
    }
    if (result === 'checkmate') {
      return winner === userId ? 'Won by Checkmate' : 'Lost by Checkmate';
    }
    return 'Game Ended';
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading your game history...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please log in to view your game history.</p>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No completed games found.</p>
        <p className="text-sm text-muted-foreground mt-2">Start playing chess to build your game history!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <Card key={game.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">
                    vs {game.player1 === currentUser.uid ? game.player2 : game.player1}
                  </h3>
                  <Badge variant={getResultBadgeColor(game.result, game.winner, currentUser.uid)}>
                    {getResultText(game.result, game.winner, currentUser.uid)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Played on {game.endedAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/game/${game.id}`}>
                    Review Game
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}