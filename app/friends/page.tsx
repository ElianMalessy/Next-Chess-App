import Navbar from '@/components/navbar/navbar';
import FriendLink from './friend-link';
import ChallengeLink from './challenge-link';
import FriendCardServer from './friend-card-server';

import {Card, CardHeader, CardTitle, CardContent, CardDescription} from '@/components/ui/card';

export default function Friends() {
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <div className='flex h-full w-full justify-center items-center flex-col gap-4'>
          <CardHeader>
            <CardTitle>Friends</CardTitle>
          </CardHeader>
          {/* <div className='grid grid-cols-2 grid-rows-2 gap-4'> */}
          <div className='grid grid-cols-2 grid-rows-1 gap-4'>
            <FriendLink />
            {/* <Dialog>
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
            </Dialog> */}
            <ChallengeLink />
            {/* <Dialog>
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
            </Dialog> */}
          </div>
          <FriendCardServer />
        </div>
      </main>
    </>
  );
}
