'use server';

import Image from 'next/image';
import {cookies} from 'next/headers';
import {UserX, MessageSquarePlus, Swords} from 'lucide-react';
import {collection, getDocs, query, where, documentId, limit} from '@firebase/firestore';

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import {firestore} from '@/components/firebase';

import NonGameBoard from '@/components/board/non-game-board';
import Client from './client';

export default async function Server({username}: {username: string}) {
  let userImg = '';
  let alert = '';
  const nextCookies = cookies();
  const cookie = nextCookies.get('friends');
  if (cookie?.value) {
    const friends = JSON.parse(cookie?.value || '');
    for (let i = 0; i < friends.length; i++) {
      if (friends[i].username === username) {
        userImg = friends[i].profilePic;
        alert = `You are already friends with ${username}`;
        break;
      }
    }
  }
  let userEmail = '';
  const q = query(collection(firestore, 'users'), where('username', '==', username), limit(1));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];

    userImg = docSnap.data().profilePic;
    userEmail = docSnap.id;
  }

  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <>
      {querySnapshot.empty ? (
        <div className='w-[calc(100vw-1rem)] flex items-center flex-col gap-2'>
          <div className='text-2xl'>404 - User Not Found</div>
          <div className='relative h-[min(560px,95vw)] w-[min(560px,95vw)]'>
            <NonGameBoard />
          </div>
        </div>
      ) : (
        <>
          <Client username={username} alert={alert} userEmail={userEmail} />
          <Card className='flex flex-row items-center'>
            <div className='ml-8'>
              <Avatar className='w-24 h-24'>
                <Image src={userImg || defaultImg} alt='currentUser-profile-picture' width={96} height={96} priority />
              </Avatar>
            </div>
            <div>
              <CardHeader>
                <CardTitle>{username || 'user'}</CardTitle>
                <CardDescription>Friends for 10 months</CardDescription>
              </CardHeader>
              <CardContent className='w-full flex gap-2'>
                <Swords strokeWidth={1} />
                <MessageSquarePlus strokeWidth={1} />
                <UserX strokeWidth={1} />
              </CardContent>
            </div>
          </Card>
        </>
      )}
    </>
  );
}
