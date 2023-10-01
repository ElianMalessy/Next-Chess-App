'use server';
import {kv} from '@vercel/kv';

export default async function AddFriend(currentUserID: string, friendID: string) {
  const isFriend = await kv.sismember(`${currentUserID}/friends/IDs`, friendID);
  if (isFriend === 1) {
    const oldFriend = await kv.hgetall(friendID);
    return oldFriend && {since: oldFriend.since, photoURL: oldFriend.photoURL, old: true};
  }

  const currentUserData = await kv.hgetall(currentUserID);
  const friendData = await kv.hgetall(friendID);
  if (!friendData) return;

  const timestamp = await kv.time();
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
  await kv.sadd(`${currentUserID}/friends/IDs`, friendID);
  await kv.sadd(`${friendID}/friends/IDs`, currentUserID);

  return {since: timestamp, photoURL: friendData?.photoURL, old: false};
}
