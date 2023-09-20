import Navbar from '@/components/navbar/navbar';
import Server from './server';
import FriendChat from './friend-chat';

export default function User({params}: {params: {id: string}}) {
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <Server username={params.id} />
        {/* <FriendChat friendEmail={'eql458@gmail.com'} /> */}
      </main>
    </>
  );
}
