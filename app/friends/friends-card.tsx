'use server';
import Image from 'next/image';
import {kv} from '@vercel/kv';
import {UserX, MessageSquarePlus, Swords} from 'lucide-react';

import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import getCurrentUser from '@/components/server-actions/getCurrentUser';

export default async function FriendsCard() {
  const currentUser = await getCurrentUser();
  const friends = await kv.get(`${currentUser?.email}/friends`);
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
                    src={friend?.profilePic || defaultImg}
                    alt='currentUser-profile-picture'
                    width={96}
                    height={96}
                  />
                </Avatar>
              </div>
              <div>
                <CardHeader>
                  <CardTitle>{friend.username}</CardTitle>
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
