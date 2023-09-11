'use client';
import {useSearchParams} from 'next/navigation';
import {collection, doc, updateDoc, getDocs, query, where, arrayUnion} from '@firebase/firestore';

import {Card, CardContent} from '@/components/ui/card';
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar';
import {firestore} from '@/components/firebase';
import {useAuth} from '@/components/contexts/auth-provider';

export default function User({params}: {params: {id: string}}) {
  const {currentUser} = useAuth();
  const friend = useSearchParams().get('friend');

  if (currentUser && friend) {
    const userRef = collection(firestore, 'users');
    const q = query(userRef, where('name', '==', params.id.replaceAll('_', ' ')));
    getDocs(q).then((snapshot) => {
      snapshot.forEach((document) => {
        updateDoc(doc(userRef, currentUser?.email || undefined), {
          friends: arrayUnion(document.id),
          // add "you are already friends with alert"
        });
        updateDoc(doc(userRef, document.id || undefined), {
          friends: arrayUnion(currentUser?.email),
        });
      });
    });
  }

  return (
    <div className='flex h-full w-full flex-col gap-4'>
      <div className='flex h-[75%] w-full justify-center items-center flex-col gap-4'>
        <Card className='p-2'>
          <CardContent className='flex flex-row'>
            <Avatar className='h-11 w-11'>
              <AvatarImage
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Font_Awesome_5_solid_user-circle.svg/991px-Font_Awesome_5_solid_user-circle.svg.png'
                alt='profile-picture'
              />
              <AvatarFallback>{params.id.replaceAll('_', ' ') || 'WE'}</AvatarFallback>
            </Avatar>
            <div className='flex w-full h-full flex-col'>
              <div className=' text-2xl'>{params.id.replaceAll('_', ' ') || 'Username'}</div>
              <div>last logged in</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
