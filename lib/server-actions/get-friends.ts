'use server';
import {kv} from '@vercel/kv';

export default async function getFriends(currentUserID: string) {
  return kv.lrange(`${currentUserID}/friends`, 0, -1);
}
