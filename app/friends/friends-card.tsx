'use client';
import {useState, useRef, useEffect} from 'react';
import Image from 'next/image';
import {validate} from 'uuid';
import Fuse from 'fuse.js';

import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import {Command, CommandInput} from '@/components/ui/command';
import FriendCardContent from './friend-card-content';

export default function FriendsCard({friends, currentUser}: {friends: any[]; currentUser: any}) {
  const [friendsSearchList, setFriendsSearchList] = useState(friends);
  const [search, setSearch] = useState('');
  const fuseOptions = {
    keys: ['username'],
  };
  const fuse = useRef(new Fuse(friends, fuseOptions));
  console.log(fuse.current.search(''));

  useEffect(() => {
    if (friends && friendsSearchList.length === 0 && search === '') setFriendsSearchList(friends);
  }, [friendsSearchList, friends, search]);
  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <Card className='w-[50%] p-2'>
      <CardContent className='flex justify-center'>
        <Command className='rounded-lg border shadow-md w-[20vw]'>
          <CommandInput
            placeholder='Search for friends...'
            onValueChange={(search: string) => {
              setSearch(search);
              setFriendsSearchList(fuse.current.search(search));
            }}
          />
        </Command>
      </CardContent>
      <CardContent>
        {friendsSearchList &&
          friendsSearchList.map((friend: any, index: number) => {
            let friendValues = friend;
            if (friend.item) friendValues = friend.item;
            return (
              <Card key={index} className='flex flex-row items-center'>
                <div className='ml-8'>
                  <Avatar className='w-24 h-24'>
                    <Image
                      src={friendValues?.photoURL || defaultImg}
                      alt='currentUser-profile-picture'
                      width={96}
                      height={96}
                    />
                  </Avatar>
                </div>
                <div>
                  <CardHeader>
                    <CardTitle>
                      {friendValues.username
                        ? validate(friendValues.username)
                          ? 'anonymous'
                          : friendValues.username.replaceAll('_', ' ')
                        : 'user'}
                    </CardTitle>
                    <CardDescription>
                      {friendValues.since !== '' && `Friends since: ${new Date(friendValues.since * 1000)}`}
                    </CardDescription>
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
