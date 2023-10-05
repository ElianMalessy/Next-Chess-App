import getCurrentUser from '@/lib/server-actions/get-current-user';
import {kv} from '@vercel/kv';
import Profile from './profile';
export default async function ProfileServer() {
  const currentUser = await getCurrentUser();
  let currentUserData;
  if (currentUser) currentUserData = await kv.hgetall(currentUser?.uid);

  return <Profile currentUserData={currentUserData} />;
}
