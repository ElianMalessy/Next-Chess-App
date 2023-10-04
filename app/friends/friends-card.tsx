'use client';
import {useState, useRef, useEffect} from 'react';
import Image from 'next/image';
import {validate} from 'uuid';
import Fuse from 'fuse.js';

import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import {Command, CommandInput} from '@/components/ui/command';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import FriendCardContent from './friend-card-content';
import UserCardContent from '@/components/user-card-content';

export default function FriendsCard({
  friends,
  currentUser,
  friendRequests,
}: {
  friends: any[];
  currentUser: any;
  friendRequests: any[];
}) {
  const [friendsSearchList, setFriendsSearchList] = useState(friends);
  const [friendRequestsSearchList, setFriendRequestsSearchList] = useState(friendRequests);
  const [search, setSearch] = useState('');
  const fuseOptions = {
    keys: ['username'],
  };
  const friendsFuse = useRef(new Fuse(friendsSearchList, fuseOptions));
  const friendRequestsFuse = useRef(new Fuse(friendRequestsSearchList, fuseOptions));

  useEffect(() => {
    if (friends && friendsSearchList.length === 0 && search === '') setFriendsSearchList(friends);
  }, [friendsSearchList, friends, search]);
  useEffect(() => {
    if (friendRequests && friendRequestsSearchList.length === 0 && search === '')
      setFriendRequestsSearchList(friendRequests);
  }, [friendRequestsSearchList, friendRequests, search]);
  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  return (
    <Card className='2xs:w-[95vw] sm:w-[75vw] lg:w-[55vw] p-2'>
      <CardHeader className='justify-center w-full flex-row'>
        <Command className='rounded-lg border shadow-md w-[50%]'>
          <CommandInput
            placeholder='Search for users...'
            onValueChange={(search: string) => {
              setSearch(search);
              setFriendsSearchList(friendsFuse.current.search(search));
              setFriendRequestsSearchList(friendRequestsFuse.current.search(search));
            }}
          />
        </Command>
      </CardHeader>
      <CardContent className='w-full'>
        <Tabs defaultValue='Friends' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='Friends'>Friends</TabsTrigger>
            <TabsTrigger value='Requests'>Requests</TabsTrigger>
          </TabsList>
          <TabsContent value='Friends' className='w-full'>
            {friendsSearchList &&
              friendsSearchList.map((friend: any, index: number) => {
                let friendValues = friend;
                if (friendValues.item) friendValues = friendValues.item;
                return (
                  <Card key={index} className='flex flex-row items-center'>
                    <Avatar className='ml-8 w-24 h-24'>
                      <Image
                        src={friendValues?.photoURL || defaultImg}
                        alt='currentUser-profile-picture'
                        width={96}
                        height={96}
                      />
                    </Avatar>
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
                    <CardContent className='p-2'>
                      <UserCardContent
                        currentUser={currentUser}
                        pageUser={friendValues}
                        isFriend={true}
                        isOldFriend={1}
                      />
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>
          <TabsContent value='Requests' className='w-full'>
            {friendRequestsSearchList &&
              friendRequestsSearchList.map((friendRequest: any, index: number) => {
                let friendRequestValues = friendRequest;
                if (friendRequestValues.item) friendRequestValues = friendRequestValues.item;
                return (
                  <Card key={index} className='flex flex-row items-center w-full'>
                    <CardHeader className='2xs:p-2 sm:p-6'>
                      <CardTitle className='2xs:text-lg sm:text-2xl'>
                        {friendRequestValues.username
                          ? validate(friendRequestValues.username)
                            ? `anonymous (${friendRequestValues.username})`
                            : friendRequestValues.username.replaceAll('_', ' ')
                          : 'user'}
                      </CardTitle>
                      <CardDescription>
                        {friendRequestValues.since !== '' && `Requested: ${new Date(friendRequestValues.since * 1000)}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='p-2'>
                      <UserCardContent
                        currentUser={currentUser}
                        pageUser={friendRequestValues}
                        isFriend={false}
                        isOldFriend={0}
                        friendRequest={true}
                      />
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
