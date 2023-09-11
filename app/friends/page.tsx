'use client';
import {useState, useEffect} from 'react';
import {CopyIcon} from '@radix-ui/react-icons';
import {Link, ChevronRight, Mail, Swords, MessagesSquare} from 'lucide-react';
import {collection, doc, updateDoc, getDocs, query, where, arrayRemove, getDoc} from '@firebase/firestore';

import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '@/components/ui/command';
import {Button} from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {useToast} from '@/components/ui/use-toast';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

import {useAuth} from '@/components/contexts/auth-provider';
import {firestore} from '@/components/firebase';

export default function Friends() {
  const {currentUser} = useAuth();
  const {toast} = useToast();
  const friendLink = `http://localhost:3000/user/${currentUser?.displayName?.replaceAll(' ', '_')}?friend=true`;
  const [friends, setFriends] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser) return;

      const userRef = doc(firestore, 'users', currentUser?.email || '');
      const snapshot = await getDoc(userRef);
      console.log(snapshot.data()?.friends);
      if (snapshot.data()?.friends) {
        const friendsPromises = snapshot.data()?.friends.map(async (friend: string) => {
          const snap = await getDoc(doc(firestore, 'users', friend));
          return snap.data()?.name;
        });
        const friendsData: any = await Promise.all(friendsPromises);
        setFriends(friendsData);
        setFriendsCount(friendsData.length);
      }
    };
    fetchFriends().catch(console.error);
  }, [currentUser]);

  return (
    <div className='flex h-full w-full flex-col gap-4'>
      <div className='flex h-[75%] w-full justify-center items-center flex-col gap-4'>
        <CardHeader>
          <CardTitle>Friends</CardTitle>
        </CardHeader>
        <div className='grid grid-cols-2 grid-rows-2 gap-4'>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' className='text-2xl py-9 px-5 flex items-center text-left gap-4'>
                <Link />
                Friend Link
                <ChevronRight className='ml-auto' />
              </Button>
            </DialogTrigger>
            <DialogContent className='w-full'>
              <DialogHeader>
                <DialogTitle className='w-full text-center'>Friend Link</DialogTitle>
                <DialogDescription className='w-full text-center'>
                  Send this link to anyone, and they will become your friend when they sign up.
                </DialogDescription>
              </DialogHeader>
              <div className='w-full relative'>
                <Input id='friend-link' value={friendLink} readOnly aria-readonly autoFocus />
                <div className='absolute h-full margin-0 flex items-center justify-end top-0 right-[0.75rem]'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CopyIcon
                          onClick={() => {
                            navigator.clipboard.writeText(friendLink);
                            toast({
                              title: 'Copied to clipboard:',
                              description: friendLink,
                            });
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' className='text-2xl py-9 px-5 gap-4'>
                <Mail />
                Send Email Invite
                <ChevronRight className='ml-auto' />
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className='w-full text-center'>Send Email Invite</DialogTitle>
              </DialogHeader>
              <Input />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' className='text-2xl py-9 px-5 gap-4'>
                <Swords />
                Create Challenge Link
                <ChevronRight className='ml-auto' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='w-full text-center'>Create Challenge Link</DialogTitle>
              </DialogHeader>
              <Input />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline' className='text-2xl py-9 px-5 gap-4'>
                <MessagesSquare />
                Create Group Chat
                <ChevronRight className='ml-auto' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='w-full text-center'>Create Group Chat</DialogTitle>
              </DialogHeader>
              <Input />
            </DialogContent>
          </Dialog>
        </div>
        <Card className='p-2'>
          <CardContent>
            <Command className='rounded-lg border shadow-md'>
              <CommandInput placeholder='Search for friends...' />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {friends.map((friend: string, index: number) => {
                    return <CommandItem key={index}>{friend}</CommandItem>;
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
