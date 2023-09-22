'use server';
import {kv} from '@vercel/kv';

export default async function AddFriend(currentUserName: string, friendName: string) {
  // const currentUserFriends: any = await kv.lrange(`${currentUserName}/friends`, 0, -1);
  // for (let i = 0; i < currentUserFriends.length; i++) {
  //   if (currentUserFriends[i].username === friendName) {
  //     return false;
  //   }
  // }
  const isFriend = await kv.sismember(`${currentUserName}/friends/usernames`, friendName);
  if (isFriend === 1) return false;

  const currentUserData = await kv.hgetall(currentUserName);
  const friendData = await kv.hgetall(friendName);
  const timestamp = kv.time;
  await kv.lpush(`${currentUserName}/friends`, {
    photoURL: friendData?.photoURL,
    email: friendData?.email,
    username: friendName,
    since: timestamp,
  });
  await kv.lpush(`${friendName}/friends`, {
    photoURL: currentUserData?.photoURL,
    email: currentUserData?.email,
    username: currentUserName,
    since: timestamp,
  });
  await kv.sadd(`${currentUserName}/friends/usernames`, friendName);
  await kv.sadd(`${friendName}/friends/usernames`, currentUserName);

  return true;
}
