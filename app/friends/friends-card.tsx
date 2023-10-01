'use client';
import {useState, useRef, useTransition, useCallback} from 'react';
import Image from 'next/image';
import {validate} from 'uuid';
import Fuse from 'fuse.js';

import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import {Command, CommandInput} from '@/components/ui/command';
import FriendCardContent from './friend-card-content';

export default function FriendsCard({friends, currentUser}: {friends: any[]; currentUser: any}) {
  const inputRef = useRef<HTMLInputElement | null>();
  const [isPending, startTransition] = useTransition();

  const [friendsSearchList, setFriendsSearchList] = useState(friends);
  const fuseOptions = {
    keys: ['username'],
  };
  const fuse = useRef(new Fuse(friends, fuseOptions));
  const setInputRef = useCallback((ref: HTMLInputElement | null) => {
    if (ref && inputRef.current?.value !== ref.value) {
      inputRef.current = ref;
      startTransition(() => {
        setFriendsSearchList(fuse.current.search(ref.value));
      });
    }
  }, []);

  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <Card className='w-[50%] p-2'>
      <CardContent className='flex justify-center'>
        <Command className='rounded-lg border shadow-md w-[20vw]'>
          <CommandInput placeholder='Search for friends...' ref={(ref) => setInputRef(ref)} />
        </Command>
      </CardContent>
      <CardContent>
        {friendsSearchList &&
          friendsSearchList.map((friend: any, index: number) => {
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
                    <CardTitle>
                      {friend.username
                        ? validate(friend.username)
                          ? 'anonymous'
                          : friend.username.replaceAll('_', ' ')
                        : 'user'}
                    </CardTitle>
                    <CardDescription>{friend.since !== '' && `Friends since: ${friend.since}`}</CardDescription>
                  </CardHeader>
                  <FriendCardContent currentUser={currentUser} friend={friend} />
                </div>
              </Card>
            );
          })}
      </CardContent>
    </Card>
  );
}
