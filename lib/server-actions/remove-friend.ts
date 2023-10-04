'use server';
import {kv} from '@vercel/kv';
import {getFriendRequests} from './get-friends';

export default async function removeFriend(currentUser: any, friend: any) {
  await kv.lrem(`${currentUser.uid}/friends`, 1, {
    uid: friend.uid,
    photoURL: friend?.photoURL,
    username: friend.username,
    since: friend.timestamp,
  });
  await kv.lrem(`${friend.uid}/friends`, 1, {
    uid: currentUser.uid,
    photoURL: currentUser?.photoURL,
    username: currentUser.name,
    since: friend.timestamp,
  });

  await kv.srem(`${currentUser.uid}/friends/IDs`, friend.uid);
  await kv.srem(`${friend.uid}/friends/IDs`, currentUser.uid);
}

export async function removeFriendRequest(currentUser: any, friend: any) {
  const currentUserFriendRequests: any[] = await getFriendRequests(currentUser.uid);
  for (let i = 0; i < currentUserFriendRequests.length; i++) {
    if (currentUserFriendRequests[i] === friend.uid) {
      await kv.lrem(`${currentUser.uid}/friendRequests`, 1, currentUserFriendRequests[i]);
      return;
    }
  }
}
