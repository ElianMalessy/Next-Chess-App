'use server';
import getCurrentUser from '@/components/server-actions/getCurrentUser';
import {kv} from '@vercel/kv';

export default async function getFriends() {
  const currentUser = await getCurrentUser();
  const names: string[] = await kv.lrange(`${currentUser?.uid}/friends`, 0, -1);
  const friends = [];
  for (let i = 0; i < names.length; i++) {
    friends.push(await kv.hgetall(names[i]));
  }
  return friends;
}
