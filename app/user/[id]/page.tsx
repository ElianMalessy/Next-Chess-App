import Navbar from '@/components/navbar/navbar';
import ProfileCard from './profile-card';
import FriendChat from './friend-chat';
import {kv} from '@vercel/kv';
import getCurrentUser from '@/components/server-actions/getCurrentUser';

export default async function User({
  params,
  searchParams,
}: {
  params: {id: string};
  searchParams?: {[key: string]: string | string[] | undefined};
}) {
  const friendRequest = searchParams?.friend ? true : false;
  const pageUser: any = await kv.hgetall(params.id);
  const currentUser = await getCurrentUser();
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
        {currentUser?.email && currentUser?.email !== pageUser.email && (
          <FriendChat
            friendEmail={pageUser.email}
            friendUsername={params.id}
            currentUserEmail={currentUser?.email}
            currentUserName={currentUser?.displayName}
          />
        )}
      </main>
    </>
  );
}
