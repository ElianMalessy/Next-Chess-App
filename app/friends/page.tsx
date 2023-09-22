import {Link, ChevronRight, Mail, MessagesSquare, Loader2} from 'lucide-react';

import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';
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

import Navbar from '@/components/navbar/navbar';
import FriendsCard from './friends-card';
import FriendLink from './friend-link';
import {Skeleton} from '@/components/ui/skeleton';
import {Suspense} from 'react';

export default function Friends() {
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <div className='flex h-full w-full justify-center items-center flex-col gap-4'>
          <CardHeader>
            <CardTitle>Friends</CardTitle>
          </CardHeader>
          <div className='grid grid-cols-2 grid-rows-2 gap-4'>
            <FriendLink />
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
                  <Link />
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
          <Card className='w-[50%] p-2'>
            <CardContent className='flex justify-center'>
              <Command className='rounded-lg border shadow-md w-[20vw]'>
                <CommandInput placeholder='Search for friends...' />
              </Command>
            </CardContent>
            <CardContent>
              {/* <Suspense fallback={<Loader2 className='h-4 w-4 animate-spin' />}> */}
              <FriendsCard />
              {/* </Suspense> */}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
