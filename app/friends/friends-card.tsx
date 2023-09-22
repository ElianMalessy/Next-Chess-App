'use server';
import Image from 'next/image';
import {UserX, MessageSquarePlus, Swords} from 'lucide-react';
import {Suspense, useEffect, useState} from 'react';

import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import getFriends from './get-friends';

export default async function FriendsCard() {
  let friends: any = await getFriends();
  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <>
      {friends &&
        friends.map((friend: any, index: number) => {
          return (
            <Card key={index} className='flex flex-row items-center'>
              <div className='ml-8'>
                <Avatar className='w-24 h-24'>
                  <Image
                    src={friend?.photoURL || defaultImg}
                    alt='currentUser-profile-picture'
                    width={96}
                    height={96}
                  />
                </Avatar>
              </div>
              <div>
                <CardHeader>
                  <CardTitle>{friend.username.replaceAll('_', ' ')}</CardTitle>
                  <CardDescription>Friends for 10 months</CardDescription>
                </CardHeader>
                <CardContent className='w-full flex gap-2'>
                  <Swords strokeWidth={1} />
                  <MessageSquarePlus strokeWidth={1} />
                  <UserX strokeWidth={1} />
                </CardContent>
              </div>
            </Card>
          );
        })}
    </>
  );
}
