import Board from '@/components/game/board';
export default function Home() {
  return (
    <div className='flex h-screen w-screen flex-row items-center justify-center'>
      <div className='flex justify-center items-center'>
        <Board/>
      </div>
    </div>
  );
}
