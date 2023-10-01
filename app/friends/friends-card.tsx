'use server';
import Image from 'next/image';
import {kv} from '@vercel/kv';

import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';
import {Avatar} from '@/components/ui/avatar';
import getFriends from '../../components/server-actions/get-friends';
import getCurrentUser from '@/components/server-actions/get-current-user';

export default async function FriendsCard() {
  const currentUser = await getCurrentUser();
  let friends: any = null;
  let currentUserData: any = null;
  let friendData: any = [];
  if (currentUser) {
    friends = await getFriends(currentUser);
    currentUserData = await kv.hgetall(currentUser.uid);
    if (friends && friends.length) {
      for (let i = 0; i < friends.length; i++) {
        friendData.push(await kv.hgetall(friends[i].uid));
      }
    }
  }
  const defaultImg =
    'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
  const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return (
    <>
      {friends &&
        friends.map(async (friend: any, index: number) => {
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
                    {friend.username && uuidPattern.test(friend.username)
                      ? 'anonymous'
                      : friend.username.replaceAll('_', ' ')}
                  </CardTitle>
                  <CardDescription>{friend.since !== '' && `Friends since: ${friend.since}`}</CardDescription>
                </CardHeader>
              </div>
            </Card>
          );
        })}
    </>
  );
}
