'use server';
import Image from 'next/image';
import {cookies} from 'next/headers';
import {UserX, MessageSquarePlus, Swords} from 'lucide-react';

import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Avatar} from '@/components/ui/avatar';

export default async function FriendsCard() {
  const nextCookies = cookies();
  const cookie = nextCookies.get('friends');
  const friends = cookie?.value ? JSON.parse(cookie?.value || '') : null;
  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';

  return (
    <Card className='w-[50%] p-2'>
      <CardContent className='flex justify-center'>
        <Command className='rounded-lg border shadow-md w-[20vw]'>
          <CommandInput placeholder='Search for friends...' />
        </Command>
      </CardContent>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
