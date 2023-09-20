'use server';

import Image from 'next/image';
import {cookies} from 'next/headers';
import {UserX, MessageSquarePlus, Swords} from 'lucide-react';
import {collection, getDocs, query, where, documentId, limit, doc, getDoc} from '@firebase/firestore';
import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import {firestore} from '@/components/firebase';

import NonGameBoard from '@/components/board/non-game-board';
import Client from './client';
import getCurrentUser from '@/components/server-actions/getCurrentUser';
import FriendChat from './friend-chat';
import {serverConfig} from '@/firebase-config';
import {kv} from '@vercel/kv';

export default async function Server({username}: {username: string}) {
  const currentUserToken = await getCurrentUser();
  const currentUser = await kv.hgetall(currentUserToken?.displayName || '');
  const pageUser = await kv.hgetall(username);

  let userImg = pageUser?.photoURL;
  let userEmail: any = pageUser?.email;
  let alert = '';

  let since = '';
  let isFriend = false;
  let querySnapshot = null;

  if (username !== currentUserToken?.displayName) {
    const friends: any = await kv.lrange(`${currentUserToken?.name.replaceAll(' ', '_')}/friends`, 0, -1);
    for (let i = 0; i < friends.length; i++) {
      if (friends[i].username === username) {
        alert = `You are already friends with ${username}`;
        isFriend = true;
        break;
      }
    }
  }
  const img: any = userImg;
  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <>
      {false ? (
        <div className='w-[calc(100vw-1rem)] flex items-center flex-col gap-2'>
          <div className='text-2xl'>404 - User Not Found</div>
          <div className='relative h-[min(560px,95vw)] w-[min(560px,95vw)]'>
            <NonGameBoard />
          </div>
        </div>
      ) : (
        <div className='w-full flex items-center flex-col'>
            <Client
              username={username}
              alert={alert}
              currentUser={currentUserToken}
            />
          <Card className='flex flex-row items-center w-[50%]'>
            <div className='ml-8'>
              <Avatar className='w-24 h-24'>
                <Image src={img || defaultImg} alt='user-profile-picture' width={96} height={96} priority />
              </Avatar>
            </div>
            <div>
              <CardHeader>
                <CardTitle>{username.replaceAll('_', ' ') || 'user'}</CardTitle>
                <CardDescription>{since !== '' && `Friends since: ${since}`}</CardDescription>
                {/* <CardDescription>
                  {firebaseUser?.metadata.creationTime &&
                    `Joined: ${new Date(firebaseUser?.metadata.creationTime).toString()}`}
                </CardDescription> */}
              </CardHeader>
              <CardContent className='w-full flex gap-2'>
                <Swords strokeWidth={1} />
                <MessageSquarePlus strokeWidth={1} />
                <UserX strokeWidth={1} />
              </CardContent>
            </div>
          </Card>
          {/* {isFriend && <FriendChat friendEmail={userEmail} />} */}
        </div>
      )}
    </>
  );
}
