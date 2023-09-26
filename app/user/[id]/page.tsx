import Navbar from '@/components/navbar/navbar';
import ProfileCard from './profile-card';
import FriendChat from './friend-chat';
import {kv} from '@vercel/kv';

export default async function User({
  params,
  searchParams,
}: {
  params: {id: string};
  searchParams?: {[key: string]: string | string[] | undefined};
}) {
  const friendRequest = searchParams?.friend ? true : false;
  const pageUser: any = await kv.hgetall(params.id);

  return (
    <>
      <Navbar />
      <main className='p-2'>
        <ProfileCard
          username={params.id}
          userImg={pageUser.photoURL}
          userEmail={pageUser.email}
          friendRequest={friendRequest}
        />
        <FriendChat friendEmail={pageUser.email} friendUsername={params.id} />
      </main>
    </>
  );
}
