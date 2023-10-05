'use server';
import {kv} from '@vercel/kv';
import {getFriendRequest, getFriendRequests, getFriend} from './get-friends';
import {DecodedIdToken} from 'next-firebase-auth-edge/lib/auth/token-verifier';
import {PageUser, FriendReturnObject, FriendRequest, FriendRequestReturnObject} from '../types/kv-types';

export default async function addFriend(
  currentUser: DecodedIdToken,
  friend: PageUser,
  isOldFriend: number
): Promise<FriendReturnObject | FriendRequestReturnObject | null> {
  if (isOldFriend === 1) {
    const oldFriend = await getFriend(currentUser.uid, friend.uid);
    return oldFriend && {since: oldFriend.since, photoURL: oldFriend.photoURL, old: true, isRequest: false};
  }

  const currentUserFriendRequests: any[] = await getFriendRequests(currentUser.uid);
  let isFriendable = false;
  for (let i = 0; i < currentUserFriendRequests.length; i++) {
    if (currentUserFriendRequests[i].uid === friend.uid) {
      // console.log('', '\n\n\n currFriendReqs: ', currentUserFriendRequests[i], '\n\n\n');
      await kv.lrem(`${currentUser.uid}/friendRequests`, 1, currentUserFriendRequests[i]);
      isFriendable = true;
      break;
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
  await kv.sadd(`${currentUser.uid}/friends/IDs`, friend.uid); // get rid of this at some point
  await kv.sadd(`${friend.uid}/friends/IDs`, currentUser.uid);

  return {since: timestamp[0], photoURL: friend.photoURL, old: false, isRequest: false};
}

async function addFriendRequest(
  currentUserId: string,
  currentUsername: string,
  friendId: string
): Promise<FriendRequestReturnObject> {
  const friendRequest: FriendRequest | null = await getFriendRequest(friendId, currentUserId);
  if (friendRequest) return {since: friendRequest.since, isRequest: true, uid: friendRequest.uid};

  const timestamp = await kv.time();
  await kv.lpush(`${friendId}/friendRequests`, {
    uid: currentUserId,
    username: currentUsername,
    since: timestamp[0],
    isRequest: true,
  });
  return {since: timestamp[0], isRequest: true, uid: currentUserId};
}
