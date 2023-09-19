'use server';

import Image from 'next/image';
import {cookies} from 'next/headers';
import {UserX, MessageSquarePlus, Swords} from 'lucide-react';
import {collection, getDocs, query, where, documentId, limit, doc, getDoc} from '@firebase/firestore';

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import {firestore} from '@/components/firebase';

import NonGameBoard from '@/components/board/non-game-board';
import Client from './client';
import getCurrentUser from '@/components/server-actions/getCurrentUser';
import FriendChat from './friend-chat';

export default async function Server({username}: {username: string}) {
  const currentUser = await getCurrentUser();
  let userImg = '';
  let alert = '';
  let userEmail = '';

  let since = '';
  let isFriend = false;
  let querySnapshot = null;

  if (username !== currentUser?.displayName) {
    const nextCookies = cookies();
    const cookie = nextCookies.get('friends');
    if (cookie?.value) {
      const friends = JSON.parse(cookie?.value || '');
      for (let i = 0; i < friends.length; i++) {
        if (friends[i].username === username) {
          userImg = friends[i].profilePic;
          alert = `You are already friends with ${username}`;
          isFriend = true;
          break;
        }
      }
    }
    const q = query(collection(firestore, 'users'), where('username', '==', username), limit(1));
    querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];

      userImg = docSnap.data().profilePic;
      userEmail = docSnap.id;
      const userRef = doc(firestore, 'users', userEmail, 'friends', currentUser?.email || '');
      const userDocSnap = await getDoc(userRef);
      if (userDocSnap.exists()) {
        isFriend = true;
        since = userDocSnap.data().since;
      }
    }
  }
  const img = username === currentUser?.displayName ? currentUser.photoURL : userImg;
  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <>
      {querySnapshot?.empty ? (
        <div className='w-[calc(100vw-1rem)] flex items-center flex-col gap-2'>
          <div className='text-2xl'>404 - User Not Found</div>
          <div className='relative h-[min(560px,95vw)] w-[min(560px,95vw)]'>
            <NonGameBoard />
          </div>
        </div>
      ) : (
        <>
          {isFriend && <Client username={username} alert={alert} userEmail={userEmail} currentUser={currentUser} />}
          <Card className='flex flex-row items-center'>
            <div className='ml-8'>
              <Avatar className='w-24 h-24'>
                <Image src={img || defaultImg} alt='currentUser-profile-picture' width={96} height={96} priority />
              </Avatar>
            </div>
            <div>
              <CardHeader>
                <CardTitle>{username || 'user'}</CardTitle>
                <CardDescription>{since !== '' && `friends since: ${new Date(since).toString()}`}</CardDescription>
                {/* <CardDescription>{currentUser?.metadata.creationTime && `Joined: ${currentUser?.metadata.creationTime}`}</CardDescription> */}
              </CardHeader>
              <CardContent className='w-full flex gap-2'>
                <Swords strokeWidth={1} />
                <MessageSquarePlus strokeWidth={1} />
                <UserX strokeWidth={1} />
              </CardContent>
            </div>
          </Card>
          {isFriend && <FriendChat friendEmail={userEmail} />}
        </>
      )}
    </>
  );
}
