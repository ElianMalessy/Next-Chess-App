import getCurrentUser from '@/lib/server-actions/get-current-user';
import Profile from './profile';

export default async function ProfileServer() {
  const currentUser = await getCurrentUser();
  const currentUserData = currentUser
    ? {
        photoURL: (currentUser as any).picture,
        scale: 1,
        startOffset: {x: 0, y: 0},
      }
    : undefined;

  return <Profile currentUserData={currentUserData} />;
}
