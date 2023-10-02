import Navbar from '@/components/navbar/navbar';
import ProfileCard from './profile-card';
import FriendChat from './friend-chat';
import {kv} from '@vercel/kv';
import getCurrentUser from '@/lib/server-actions/get-current-user';
import addFriend from '@/lib/server-actions/add-friend';
import getFriends, {getFriend} from '@/lib/server-actions/get-friends';

export default async function User({
  params,
  searchParams,
}: {
  params: {id: string};
  searchParams?: {[key: string]: string | string[] | undefined};
}) {
  const friendRequest = searchParams?.friend ? true : false;

  const currentUser = await getCurrentUser();
  const pageUserID: any = await kv.get(params.id);
  const pageUser: any = await kv.hgetall(pageUserID ?? '');
  const isFriend = await kv.sismember(`${currentUser?.uid}/friends/IDs`, pageUserID);
  console.log(pageUser);

  let friend = null;
  if (!isFriend && friendRequest && currentUser?.uid && pageUser) {
    friend = await addFriend(currentUser, pageUser.photoURL, pageUserID, params.id, isFriend);
  } else if (isFriend && currentUser?.uid) {
    // getFriends(currentUser.uid)
    friend = await getFriend(currentUser.uid, params.id);
  }
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <ProfileCard
          pageUser={pageUser}
          pageUsername={params.id.replaceAll('_', ' ')}
          pageUserID={pageUserID}
          currentUser={currentUser}
          friendRequest={friendRequest}
          friend={friend}
          userCreationTime={pageUser.metadata.creationTime}
          isFriend={isFriend}
        />
        {currentUser?.email && currentUser?.email !== pageUser.email && (
          <FriendChat
            friendEmail={pageUser.email}
            friendUsername={params.id}
            currentUserEmail={currentUser?.email}
            currentUsername={currentUser?.displayName}
          />
        )}
      </main>
    </>
  );
}
