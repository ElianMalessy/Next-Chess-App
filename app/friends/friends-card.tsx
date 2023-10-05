'use client';
import Image from 'next/image';
import Link from 'next/link';

import {useState, useRef, useEffect} from 'react';
import {validate} from 'uuid';
import Fuse from 'fuse.js';

import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import {Command, CommandInput} from '@/components/ui/command';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import UserCardContent from '@/components/user-card-content';
import {Button} from '@/components/ui/button';
import {useFriendsStore} from '@/lib/hooks/useFriendsStore';

export default function FriendsCard({
  friends,
  currentUser,
  friendRequests,
}: {
  friends: any[];
  currentUser: any;
  friendRequests: any[];
}) {
  const {friendsList, friendRequestsList} = useFriendsStore();

  const [friendsSearchList, setFriendsSearchList] = useState(friendsList);
  const [friendRequestsSearchList, setFriendRequestsSearchList] = useState(friendRequestsList);
  const [search, setSearch] = useState('');
  const fuseOptions = {
    keys: ['username'],
  };
  const friendsFuse = useRef(new Fuse(friends, fuseOptions));
  const friendRequestsFuse = useRef(new Fuse(friendRequests, fuseOptions));

  const [windowDefined, setWindowDefined] = useState(false);
  useEffect(() => {
    if (friendsList.length === 0 && friendRequestsList.length === 0) {
      useFriendsStore.setState({friendsList: friends, friendRequestsList: friendRequests});
    }
    setWindowDefined(true);
  }, []);

  useEffect(() => {
    if (friendsList && friendsSearchList.length === 0 && search === '') setFriendsSearchList(friendsList);
  }, [friendsList, search, friendsSearchList]);
  useEffect(() => {
    if (friendRequestsList && friendRequestsSearchList.length === 0 && search === '')
      setFriendRequestsSearchList(friendRequestsList);
  }, [friendRequestsList, search, friendRequestsSearchList]);
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
                        {windowDefined && friendValues.username && (
                          <Button variant={'link'} asChild className='2xs:text-lg sm:text-2xl p-0'>
                            <Link
                              href={
                                window.location.protocol +
                                '//' +
                                window.location.host +
                                `/user/${friendValues.username.replaceAll(' ', '_')}`
                              }
                            >
                              {friendValues.username
                                ? validate(friendValues.username)
                                  ? 'anonymous'
                                  : friendValues.username.replaceAll('_', ' ')
                                : 'user'}
                            </Link>
                          </Button>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {friendValues.since !== '' && `Friends since: ${new Date(friendValues.since * 1000)}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='p-2'>
                      <UserCardContent currentUser={currentUser} pageUser={friendValues} isOldFriend={true} />
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
                        {windowDefined && friendRequestValues.username && (
                          <Button variant={'link'} asChild className='2xs:text-lg sm:text-2xl p-0'>
                            <Link
                              href={
                                window.location.protocol +
                                '//' +
                                window.location.host +
                                `/user/${friendRequestValues.username.replaceAll(' ', '_')}`
                              }
                            >
                              {friendRequestValues.username
                                ? validate(friendRequestValues.username)
                                  ? 'anonymous'
                                  : friendRequestValues.username.replaceAll('_', ' ')
                                : 'user'}
                            </Link>
                          </Button>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {friendRequestValues &&
                          friendRequestValues.since !== '' &&
                          `Requested: ${new Date(friendRequestValues.since * 1000)}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='p-2'>
                      <UserCardContent
                        currentUser={currentUser}
                        pageUser={friendRequestValues}
                        isOldFriend={false}
                        friendRequestValue={friendRequestValues}
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
