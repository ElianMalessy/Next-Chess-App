import Navbar from '@/components/navbar/navbar';
import ProfileCard from './profile-card';
import FriendChat from './friend-chat';
import {kv} from '@vercel/kv';
import getCurrentUser from '@/components/server-actions/get-current-user';
import AddFriend from '../../../components/server-actions/add-friend';

export default async function User({
  params,
  searchParams,
}: {
  params: {id: string};
  searchParams?: {[key: string]: string | string[] | undefined};
}) {
  const friendRequest = searchParams?.friend ? true : false;
  const currentUser = await getCurrentUser();
  const userID: any = await kv.get(params.id.replaceAll('_', ' '));
  const pageUser: any = await kv.hgetall(userID ?? '');
  let friend = null;
  if (friendRequest && currentUser?.uid) friend = await AddFriend(currentUser?.uid, userID);
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <ProfileCard
          username={params.id}
          userImg={pageUser.photoURL}
          currentUserName={currentUser?.name}
          friendRequest={friendRequest}
          friend={friend}
          userCreationTime={pageUser.metadata.creationTime}
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
