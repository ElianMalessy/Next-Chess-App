import Navbar from '@/components/navbar/navbar';
import ProfileCard from './profile-card';
import getCurrentUser from '@/lib/server-actions/get-current-user';

export default async function User({
  params,
}: {
  params: {id: string};
}) {
  const currentUser = await getCurrentUser();

  const pageUser = {
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
