'use server';
import {kv} from '@vercel/kv';
import {Friend, FriendRequest} from '../types/kv-types';

export default async function getFriends(currentUserId: string) {
  return kv.lrange(`${currentUserId}/friends`, 0, -1);
}

export async function getFriend(currentUserId: string, friendId: string): Promise<Friend | null> {
  const friends: any = await kv.lrange(`${currentUserId}/friends`, 0, -1);
  for (let i = 0; i < friends.length; i++) {
    if (friends[i].uid === friendId) return friends[i];
  }
  return null;
}

export async function getFriendRequests(userId: string): Promise<FriendRequest[]> {
  return await kv.lrange(`${userId}/friendRequests`, 0, -1);
}
export async function getFriendRequest(currentUserId: string, userId: string): Promise<FriendRequest | null> {
  const requests: any = await kv.lrange(`${currentUserId}/friendRequests`, 0, -1);
  for (let i = 0; i < requests.length; i++) {
    if (requests[i].uid === userId) return requests[i];
  }
  return null;
}
