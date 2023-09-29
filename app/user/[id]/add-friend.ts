'use server';
import {kv} from '@vercel/kv';

export default async function AddFriend(currentUserID: string, friendName: string) {
  // const currentUserFriends: any = await kv.lrange(`${currentUserName}/friends`, 0, -1);
  // for (let i = 0; i < currentUserFriends.length; i++) {
  //   if (currentUserFriends[i].username === friendName) {
  //     return false;
  //   }
  // }
  const isFriend = await kv.sismember(`${currentUserID}/friends/usernames`, friendName);
  if (isFriend === 1) return false; // already friends

  const currentUserData = await kv.hgetall(currentUserID);
  const friendID: any = await kv.get(friendName);

  if (!friendID) return false;
  const friendData = await kv.hgetall(friendID);
  const timestamp = kv.time;
  await kv.lpush(`${currentUserID}/friends`, {
    photoURL: friendData?.photoURL,
    email: friendData?.email,
    username: friendID,
    since: timestamp,
  });
  await kv.lpush(`${friendID}/friends`, {
    photoURL: currentUserData?.photoURL,
    email: currentUserData?.email,
    username: currentUserID,
    since: timestamp,
  });
  await kv.sadd(`${currentUserID}/friends/usernames`, friendID);
  await kv.sadd(`${friendID}/friends/usernames`, currentUserID);

  return true;
}
