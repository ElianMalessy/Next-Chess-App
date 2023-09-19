import Navbar from '@/components/navbar/navbar';
import Server from './server';

export default function User({params}: {params: {id: string}}) {
  const username = params.id.replaceAll('_', ' ');
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <Server username={username} />
      </main>
    </>
  );
}
