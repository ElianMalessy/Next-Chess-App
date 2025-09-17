import Navbar from '@/components/navbar/navbar';
import ProfileCard from './profile-card';
import getCurrentUser from '@/lib/server-actions/get-current-user';

export default async function User({
  params,
}: {
  params: {id: string};
}) {
  const currentUser = await getCurrentUser();
  
  // For now, we'll use the current user's data since we don't have a users collection
  // In a real app, you'd query Firestore for the user by username
  const pageUser = currentUser ? {
    photoURL: (currentUser as any).picture,
    metadata: {creationTime: (currentUser as any).auth_time},
  } : {
    photoURL: undefined,
    metadata: {creationTime: undefined},
  };

  return (
    <>
      <Navbar />
      <main className='p-2'>
        <ProfileCard
          pageUser={pageUser}
          pageUserId={params.id}
          pageUsername={params.id.replaceAll('_', ' ')}
          currentUser={currentUser}
          userCreationTime={pageUser.metadata.creationTime}
        />
      </main>
    </>
  );
}
