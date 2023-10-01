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

  const timestamp = await kv.time();
  await kv.lpush(`${currentUserID}/friends`, {
    photoURL: friendData?.photoURL,
    email: friendData?.email,
    username: friendID,
    since: timestamp[0],
  });
  await kv.lpush(`${friendID}/friends`, {
    photoURL: currentUserData?.photoURL,
    email: currentUserData?.email,
    username: currentUserID,
    since: timestamp[0],
  });
  await kv.sadd(`${currentUserID}/friends/IDs`, friendID);
  await kv.sadd(`${friendID}/friends/IDs`, currentUserID);

  return {since: timestamp[0], photoURL: friendData?.photoURL, old: false};
}
