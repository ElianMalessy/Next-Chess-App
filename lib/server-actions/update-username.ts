'use server';
import {kv} from '@vercel/kv';

export async function updateUsernameKV(currentUserId: string, newName: string, oldName: string) {
  await kv.del(oldName);
  await kv.lrem('users', 1, {username: oldName, uid: currentUserId});
  await kv.set(newName, currentUserId);
  await kv.lpush('users', {username: newName, uid: currentUserId});
}
