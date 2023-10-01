'use server';
import {kv} from '@vercel/kv';

export default function getFriends(currentUserID: string) {
  return kv.lrange(`${currentUserID}/friends`, 0, -1);
}
