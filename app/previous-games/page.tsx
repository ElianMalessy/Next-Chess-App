import Navbar from '@/components/navbar/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PreviousGamesList from './previous-games-list';

export default function PreviousGamesPage() {
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <div className='container mx-auto max-w-6xl pt-8'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold mb-2'>Previous Games</h1>
            <p className='text-muted-foreground'>Review your chess game history</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Game History</CardTitle>
            </CardHeader>
            <CardContent>
              <PreviousGamesList />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}