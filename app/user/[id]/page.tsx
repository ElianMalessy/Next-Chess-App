import Navbar from '@/components/navbar/navbar';
import Server from './server';
import FriendChat from './friend-chat';

export default function User({
  params,
  searchParams,
}: {
  params: {id: string};
  searchParams?: {[key: string]: string | string[] | undefined};
}) {
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <Server username={params.id} friend={searchParams?.friend ? true : false} />
        <FriendChat friendEmail={'eql458@gmail.com'} friendUsername={params.id} />
      </main>
    </>
  );
}
