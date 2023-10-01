'use server';
import {kv} from '@vercel/kv';
import type {DecodedIdToken} from 'next-firebase-auth-edge/lib/auth/token-verifier';

export default async function getFriends(currentUser: DecodedIdToken) {
  const names: string[] = await kv.lrange(`${currentUser?.uid}/friends`, 0, -1);
  const friends = [];
  for (let i = 0; i < names.length; i++) {
    friends.push(await kv.hgetall(names[i]));
  }
  return friends;
}
