import Navbar from '@/components/navbar/navbar';
import ProfileCard from './profile-card';
import FriendChat from './friend-chat';
import {kv} from '@vercel/kv';
import getCurrentUser from '@/lib/server-actions/get-current-user';
import addFriend from '@/lib/server-actions/add-friend';
import {getFriend} from '@/lib/server-actions/get-friends';

export default async function User({
  params,
  searchParams,
}: {
  params: {id: string};
  searchParams?: {[key: string]: string | string[] | undefined};
}) {
  const friendRequest = searchParams?.friend ? true : false;

  const currentUser = await getCurrentUser();
  const pageUserId: any = await kv.get(params.id);
  let pageUser: any = null;
  let friend: any = null;
  let isOldFriend: number = 0;

  if (pageUserId) {
    pageUser = await kv.hgetall(pageUserId ?? '');
    isOldFriend = await kv.sismember(`${currentUser?.uid}/friends/IDs`, pageUserId);
    if (!isOldFriend && friendRequest && currentUser?.uid && pageUser) {
      friend = await addFriend(
        currentUser,
        {photoURL: pageUser.photoURL, uid: pageUserId, username: params.id},
        isOldFriend
      );
    } else if (isOldFriend && currentUser?.uid) {
      friend = await getFriend(currentUser.uid, params.id);
    }
  }

  return (
    <>
      <Navbar />
      <main className='p-2'>
        <ProfileCard
          pageUser={pageUser}
          pageUsername={params.id.replaceAll('_', ' ')}
          currentUser={currentUser}
          friendRequest={friendRequest}
          friend={friend}
          userCreationTime={pageUser.metadata.creationTime}
          isOldFriend={isOldFriend}
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
