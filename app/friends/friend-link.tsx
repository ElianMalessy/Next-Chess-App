'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

import {Link, ChevronRight, Mail, MessagesSquare, UserPlus} from 'lucide-react';
import {CopyIcon} from '@radix-ui/react-icons';

import {useToast} from '@/components/ui/use-toast';
import {useAuthStore} from '@/hooks/useAuthStore';
// import {useAuth} from '@/components/contexts/auth-provider';

export default function FriendLink() {
  const {currentUser} = useAuthStore();
  const {toast} = useToast();
  const friendLink = `http://localhost:3000/user/${currentUser?.displayName?.replaceAll(' ', '_')}?friend=true`;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='text-2xl py-9 px-5 flex items-center text-left gap-4'>
          <UserPlus />
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
          <div className='absolute h-full w-9 margin-0 flex items-center justify-end top-0 right-[-0.1rem] p-2 pl-0'>
            <div className='h-full w-full flex items-center justify-end bg-background'>
              <TooltipProvider delayDuration={350}>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
