'use server';
import {kv} from '@vercel/kv';
import {getFriendRequests} from './get-friends';

export default async function addFriend(currentUser: any, friend: any, isOldFriend: number) {
  if (isOldFriend === 1) {
    const oldFriend = await kv.hgetall(friend.uid);
    return oldFriend && {since: oldFriend.since, photoURL: oldFriend.photoURL, old: true};
  }

  const theirFriendRequests: any[] = await getFriendRequests(friend.uid);
  const currentUserFriendRequests: any[] = await getFriendRequests(currentUser.uid);
  let isFriendable = false;

  for (let i = 0; i < theirFriendRequests.length; i++) {
    if (theirFriendRequests[i].uid === currentUser.uid) {
      await kv.lrem(`${friend.uid}/friendRequests`, 1, theirFriendRequests[i]);
      isFriendable = true;
      break;
    }
  }
  if (!isFriendable) {
    for (let i = 0; i < currentUserFriendRequests.length; i++) {
      if (currentUserFriendRequests[i] === friend.uid) {
        await kv.lrem(`${currentUser.uid}/friendRequests`, 1, currentUserFriendRequests[i]);
        isFriendable = true;
        break;
      }
    }
  }
  if (!isFriendable) {
    return await addFriendRequest(currentUser.uid, currentUser.name, friend.uid);
  }

  const timestamp = await kv.time();
  await kv.lpush(`${currentUser.uid}/friends`, {
    uid: friend.uid,
    photoURL: friend.photoURL,
    username: friend.username,
    since: timestamp[0],
  });
  await kv.lpush(`${friend.uid}/friends`, {
    uid: currentUser.uid,
    photoURL: currentUser?.photoURL,
    username: currentUser.name,
    since: timestamp[0],
  });
  await kv.sadd(`${currentUser.uid}/friends/IDs`, friend.uid);
  await kv.sadd(`${friend.uid}/friends/IDs`, currentUser.uid);

  return {since: timestamp[0], photoURL: friend.photoURL, old: false};
}

async function addFriendRequest(currentUserId: string, currentUsername: string, friendId: string) {
  const theirFriendRequests: any[] = await getFriendRequests(friendId);
  for (let i = 0; i < theirFriendRequests.length; i++) {
    if (theirFriendRequests[i].uid === currentUserId) return false;
  }

  const timestamp = await kv.time();
  await kv.lpush(`${friendId}/friendRequests`, {
    uid: currentUserId,
    username: currentUsername,
    since: timestamp[0],
  });
  return {since: timestamp[0]};
}
