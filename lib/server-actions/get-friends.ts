'use server';
import {kv} from '@vercel/kv';

export default async function getFriends(currentUserID: string) {
  return kv.lrange(`${currentUserID}/friends`, 0, -1);
}

export async function getFriend(currentUserID: string, friendUsername: string) {
  const friends = await kv.lrange(`${currentUserID}/friends`, 0, -1);

  for (let i = 0; i < friends.length; i++) {
    if (friends[i].username === friendUsername) return friends[i];
  }
}
