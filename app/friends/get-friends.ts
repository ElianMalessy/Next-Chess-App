'use server';
import getCurrentUser from '@/components/server-actions/getCurrentUser';
import {kv} from '@vercel/kv';

export default async function getFriends() {
  const currentUser = await getCurrentUser();
  return await kv.lrange(`${currentUser?.name.replaceAll(' ', '_')}/friends`, 0, -1);
}
