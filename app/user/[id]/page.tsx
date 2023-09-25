import Navbar from '@/components/navbar/navbar';
import Server from './server';
import FriendChat from './friend-chat';
import FriendDialog from './friend-dialog';

export default function User({
  params,
  searchParams,
}: {
  params: {id: string};
  searchParams?: {[key: string]: string | string[] | undefined};
}) {
  const friendRequest = searchParams?.friend ? true : false;
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <Server username={params.id} friendRequest={friendRequest} />
        {friendRequest && <FriendDialog username={params.id} />}
        <FriendChat friendEmail={'eql458@gmail.com'} friendUsername={params.id} />
      </main>
    </>
  );
}
