'use client';
import Image from 'next/image';
import {useSearchParams} from 'next/navigation';
import {cookies} from 'next/headers';
import {useEffect, useState} from 'react';

import {
  collection,
  doc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  arrayUnion,
  documentId,
  setDoc,
  limit,
} from '@firebase/firestore';

import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {Navbar} from '@/components/navbar/navbar';
import {UserX, MessageSquarePlus, Swords} from 'lucide-react';

import {firestore} from '@/components/firebase';
import {useAuth} from '@/components/contexts/auth-provider';

export default function User({params}: {params: {id: string}}) {
  const {currentUser} = useAuth();

  const friend = useSearchParams().get('friend');
  const username = params.id.replaceAll('_', ' ');
  const [alert, setAlert] = useState<string>('');

  useEffect(() => {
    function getCookie(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
    (async () => {
      if (getCookie('friends')) {
        setAlert(`You are already friends with ${username}`);
      } else if (currentUser?.email && friend && username) {
        let friendEmail = '';
        const q = query(collection(firestore, 'users'), where('username', '==', username), limit(1));
        const querySnapshot = await getDocs(q);
        const docSnap = querySnapshot.docs[0];
        friendEmail = docSnap.id;
        const friendDoc = doc(firestore, 'users', friendEmail, 'friends', currentUser?.email ?? '');
        const friendDocSnap = await getDoc(friendDoc);
        if (friendDocSnap.exists()) {
          setAlert(`You are already friends with ${username}`);
          return;
        }
        setDoc(friendDoc, {
          since: Date.now(),
        });

        const currentUserRef = collection(firestore, 'users', currentUser?.email, 'friends');
        setDoc(doc(currentUserRef, friendEmail), {
          since: Date.now(),
          // add "you are already friends with alert"
        });
      }
    })();
  }, [currentUser, friend, username]);
  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <>
      <Navbar>{alert}</Navbar>
      <main className='p-2'>
        {currentUser && currentUser?.displayName !== username ? (
          <Card className='flex flex-row items-center'>
            <div className='ml-8'>
              <Avatar className='w-24 h-24'>
                <Image
                  src={currentUser?.photoURL || defaultImg}
                  alt='currentUser-profile-picture'
                  width={96}
                  height={96}
                />
              </Avatar>
            </div>
            <div>
              <CardHeader>
                <CardTitle>{currentUser?.displayName || 'user'}</CardTitle>
                <CardDescription>Friends for 10 months</CardDescription>
              </CardHeader>
              <CardContent className='w-full flex gap-2'>
                <Swords strokeWidth={1} />
                <MessageSquarePlus strokeWidth={1} />
                <UserX strokeWidth={1} />
              </CardContent>
            </div>
          </Card>
        ) : (
          <div className='flex h-full w-full flex-col gap-4'>
            <div className='flex h-[75%] w-full justify-center items-center flex-col gap-4'>
              <Card className='p-2'>
                <CardContent className='flex flex-row'>
                  <Avatar className='h-24 w-24'>
                    <Image
                      src={currentUser?.photoURL || defaultImg}
                      alt='currentUser-profile-picture'
                      width={96}
                      height={96}
                    />
                    <AvatarFallback>{'WE'}</AvatarFallback>
                  </Avatar>
                  <div className='flex w-full h-full flex-col'>
                    <div className=' text-2xl'>{params.id.replaceAll('_', ' ') || 'Username'}</div>
                    <div>last logged in</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
