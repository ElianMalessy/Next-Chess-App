'use server';
import {kv} from '@vercel/kv';

export default async function removeFriend(
  currentUserID: string,
  friendID: string,
  currentUserData: any,
  friendData: any,
  timestamp: number
) {
  await kv.lrem(`${currentUserID}/friends`, 1, {
    photoURL: friendData?.photoURL,
    email: friendData?.email,
    username: friendID,
    since: timestamp,
  });
  await kv.lrem(`${friendID}/friends`, 1, {
    photoURL: currentUserData?.photoURL,
    email: currentUserData?.email,
    username: currentUserID,
    since: timestamp,
  });

  await kv.srem(`${currentUserID}/friends/IDs`, friendID);
  kv.srem(`${friendID}/friends/IDs`, currentUserID);
}
