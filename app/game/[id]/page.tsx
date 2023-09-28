import Navbar from '@/components/navbar/navbar';
import Client from './client';
import GameChat from './game-chat';
import getCurrentUser from '@/components/server-actions/getCurrentUser';
import {kv} from '@vercel/kv';
export default async function Game({params}: {params: {id: string}}) {
  const currentUser = await getCurrentUser();
  // const opponent = await kv.hgetall()
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <div className='flex h-full w-full flex-row items-center justify-center'>
          <div className='grid 2xs:grid-rows-2 sm:grid-rows-3 2xs:grid-cols-1 2xs:gap-2 lg:grid-rows-1 lg:grid-cols-5 lg:gap-8 lg:mt-12'>
            <div className='flex justify-center items-center 2xs:row-span-2 2xs:row-start-1 lg:col-span-3 lg:row-span-1 2xs:h-[100vw] sm:h-auto'>
              <div className='relative h-[min(560px,calc(100vw-0.5rem))] w-[min(560px,calc(100vw-0.5rem))]'>
                <Client
                  currentUserName={currentUser?.name}
                  currentUserEmail={currentUser?.email || ''}
                  currentUserImg={currentUser?.picture || ''}
                  currentUserID={currentUser?.uid || ''}
                  gameID={params.id}
                />
              </div>
            </div>
            <div className='2xs:row-start-3 lg:row-start-1 lg:col-span-2 lg:col-start-4 flex items-center 2xs:max-w-[min(560px,calc(100vw-0.5rem))] 2xs:max-h-[40rem] lg:max-w-[20rem] lg:max-h-[min(560px,calc(100vw-0.5rem))]'>
              <GameChat currentUserName={currentUser?.name} gameID={params.id} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
