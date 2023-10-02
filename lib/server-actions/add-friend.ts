'use server';
import {kv} from '@vercel/kv';

export default async function addFriend(
  currentUser: any,
  friendPhotoURL: any,
  friendID: string,
  friendName: string,
  isFriend: number
) {
  if (isFriend === 1) {
    const oldFriend = await kv.hgetall(friendID);
    return oldFriend && {since: oldFriend.since, photoURL: oldFriend.photoURL, old: true};
  }

  const timestamp = await kv.time();
  await kv.lpush(`${currentUser.uid}/friends`, {
    uid: friendID,
    photoURL: friendPhotoURL,
    username: friendName,
    since: timestamp[0],
  });
  await kv.lpush(`${friendID}/friends`, {
    uid: currentUser.uid,
    photoURL: currentUser?.photoURL,
    username: currentUser.name,
    since: timestamp[0],
  });
  await kv.sadd(`${currentUser.uid}/friends/IDs`, friendID);
  await kv.sadd(`${friendID}/friends/IDs`, currentUser.uid);

  return {since: timestamp[0], photoURL: friendPhotoURL, old: false};
}
