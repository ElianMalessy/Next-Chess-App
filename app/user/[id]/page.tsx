import Navbar from '@/components/navbar/navbar';
import ProfileCard from './profile-card';
import FriendChat from './friend-chat';
import {kv} from '@vercel/kv';
import getCurrentUser from '@/lib/server-actions/get-current-user';
import addFriend from '@/lib/server-actions/add-friend';
import {getFriend, getFriendRequest} from '@/lib/server-actions/get-friends';
import {FriendRequest} from '@/lib/types/kv-types';

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
  const pageUser: any = await kv.hgetall(pageUserId ?? '');
  let friendObject: any = null;
  let isOldFriend: number = 0;

  if (currentUser?.uid && pageUser && pageUserId !== currentUser?.uid) {
    isOldFriend = await kv.sismember(`${currentUser?.uid}/friends/IDs`, pageUserId);
    if (!friendRequest && isOldFriend === 0) {
      friendObject = await getFriendRequest(currentUser.uid, pageUserId);
    }
    if (!friendObject) {
      friendObject = await addFriend(
        currentUser,
        {photoURL: pageUser.photoURL, uid: pageUserId, username: params.id},
        isOldFriend
      );
    }
  }

  return (
    <>
      <Navbar />
      <main className='p-2'>
        <ProfileCard
          pageUser={pageUser}
          pageUserId={pageUserId}
          pageUsername={params.id.replaceAll('_', ' ')}
          currentUser={currentUser}
          friend={friendObject}
          userCreationTime={pageUser.metadata.creationTime}
          isOldFriend={isOldFriend}
        />
        {/* {currentUser?.email && currentUser?.email !== pageUser.email && (
          <FriendChat
            friendEmail={pageUser.email}
            friendUsername={params.id}
            currentUserEmail={currentUser?.email}
            currentUsername={currentUser?.displayName}
          />
        )} */}
      </main>
    </>
  );
}
