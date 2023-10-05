import getFriends, {getFriendRequests} from '@/lib/server-actions/get-friends';
import getCurrentUser from '@/lib/server-actions/get-current-user';
import FriendsCard from './friends-card';
export default async function FriendCardServer() {
  const currentUser = await getCurrentUser();
  let friends: any = null;
  let friendRequests: any = null;
  if (currentUser) {
    friends = await getFriends(currentUser.uid);
    friendRequests = await getFriendRequests(currentUser.uid);
  }
  return <FriendsCard friends={friends} currentUser={currentUser} friendRequests={friendRequests} />;
}
