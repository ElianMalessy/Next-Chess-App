'use server';
import {kv} from '@vercel/kv';

export default async function removeFriend(currentUser: any, friend: any) {
  await kv.lrem(`${currentUser.uid}/friends`, 1, {
    photoURL: friend?.photoURL,
    username: friend.username,
    since: friend.timestamp,
  });
  await kv.lrem(`${friend.uid}/friends`, 1, {
    photoURL: currentUser?.photoURL,
    username: currentUser.name,
    since: friend.timestamp,
  });

  await kv.srem(`${currentUser.uid}/friends/IDs`, friend.uid);
  kv.srem(`${friend.uid}/friends/IDs`, currentUser.uid);
}
