'use server';
import {kv} from '@vercel/kv';

export default async function AddFriend(currentUserName: string, friendName: string) {
  const currentUserFriends: any = await kv.lrange(`${currentUserName}/friends`, 0, -1);
  for (let i = 0; i < currentUserFriends.length; i++) {
    if (currentUserFriends[i].username === friendName) {
      return false;
    }
  }
  const currentUserData = await kv.hgetall(currentUserName);
  const friendData = await kv.hgetall(friendName);
  await kv.lpush(`${currentUserName}/friends`, {
    photoURL: friendData?.photoURL,
    email: friendData?.email,
    username: friendName,
  });
  await kv.lpush(`${friendName}/friends`, {
    photoURL: currentUserData?.photoURL,
    email: currentUserData?.email,
    username: currentUserName,
  });
  return true;
}
