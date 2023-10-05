'use server';
import {kv} from '@vercel/kv';
import {Friend} from '../types/kv-types';

export async function deleteUser(currentUserId: string, currentUsername: string, currentUserPhotoURL: string) {
  await kv.lrem('users', 1, {username: currentUsername, uid: currentUserId});
  await kv.del(currentUsername.replaceAll(' ', '_'));
  await kv.del(currentUserId);

  const friends: Friend[] = await kv.lrange(`${currentUserId}/friends`, 0, -1);
  for (let i = 0; i < friends.length; i++) {
    await kv.lrem(`${friends[i].uid}/friends`, 1, {
      uid: currentUserId,
      photoURL: currentUserPhotoURL,
      username: currentUsername,
      since: friends[i].since,
    });
    await kv.lrem(`${friends[i].uid}/friendRequests`, 1, {
      uid: currentUserId,
      username: currentUsername,
      since: friends[i].since,
      isRequest: true,
    });
    await kv.del(`${friends[i].uid}/friends/IDs`);
  }
  await kv.del(`${currentUserId}/friends`);
  await kv.del(`${currentUserId}/friends/IDs`);
}
