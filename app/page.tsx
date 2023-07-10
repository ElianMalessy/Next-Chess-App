import {Navbar} from '@/components/navbar/navbar';

export default function Home() {
  return (
    <main>
      <div className='hidden flex-col md:flex'>
        <div className='border-b'>
          <div className='flex h-16 items-center px-3 bg-navBackground'>
            <Navbar />
          </div>
        </div>
      </div>
    </main>
  );
}
