'use server';
import {kv} from '@vercel/kv';

export default async function getFriends(currentUserId: string) {
  return kv.lrange(`${currentUserId}/friends`, 0, -1);
}

export async function getFriend(currentUserId: string, friendUsername: string) {
  const friends: any = await kv.lrange(`${currentUserId}/friends`, 0, -1);

  for (let i = 0; i < friends.length; i++) {
    if (friends[i].username === friendUsername) return friends[i];
  }
}

export async function getFriendRequests(userId: string) {
  return kv.lrange(`${userId}/friendRequests`, 0, -1);
}
