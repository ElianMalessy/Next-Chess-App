import Navbar from '@/components/navbar/navbar';
import Server from './server';
export default function Game({params}: {params: {id: string}}) {
  return (
    <>
      <Navbar />
      <main className='h-screen w-screen p-2'>
        <Server id={params.id} />
      </main>
    </>
  );
}
