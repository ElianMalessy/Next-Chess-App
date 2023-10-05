'use server';
import {kv} from '@vercel/kv';
import {getFriendRequests} from './get-friends';
import {DecodedIdToken} from 'next-firebase-auth-edge/lib/auth/token-verifier';
import {Friend, FriendRequest, FriendRequestReturnObject, PageUser} from '../types/kv-types';

export default async function removeFriend(currentUser: DecodedIdToken, friend: Friend) {
  await kv.lrem(`${currentUser.uid}/friends`, 1, {
    uid: friend.uid,
    photoURL: friend?.photoURL,
    username: friend.username,
    since: friend.since,
  });
  await kv.lrem(`${friend.uid}/friends`, 1, {
    uid: currentUser.uid,
    photoURL: currentUser?.photoURL,
    username: currentUser.name,
    since: friend.since,
  });

  await kv.srem(`${currentUser.uid}/friends/IDs`, friend.uid);
  await kv.srem(`${friend.uid}/friends/IDs`, currentUser.uid);
}

export async function removeFriendRequest(currentUser: DecodedIdToken, friend: PageUser) {
  const currentUserFriendRequests: FriendRequestReturnObject[] = await getFriendRequests(currentUser.uid);
  for (let i = 0; i < currentUserFriendRequests.length; i++) {
    if (currentUserFriendRequests[i].uid === friend.uid) {
      await kv.lrem(`${currentUser.uid}/friendRequests`, 1, currentUserFriendRequests[i]);
      return;
    }
  }
}
