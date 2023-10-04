'use client';
import {usePathname} from 'next/navigation';
import {useState, useEffect} from 'react';

import {Link, ChevronRight} from 'lucide-react';
import {CopyIcon} from '@radix-ui/react-icons';

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
import {useToast} from '@/components/ui/use-toast';

export default function ChallengeLink() {
  const [link, setLink] = useState('');
  const {toast} = useToast();

  useEffect(() => {
    setLink(window.location.host + '/game/' + Date.now().toString());
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='2xs:text-base sm:text-2xl py-9 px-5 gap-4'>
          <Link className='2xs:hidden sm:block'/>
          Create Challenge Link
          <ChevronRight className='ml-auto 2xs:hidden sm:block' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='w-full text-center'>Create Challenge Link</DialogTitle>
        </DialogHeader>
        <div className='w-full relative'>
          <Input id='friend-link' value={link} readOnly aria-readonly autoFocus />
          <div className='absolute h-full w-9 margin-0 flex items-center justify-end top-0 right-[-0.1rem] p-2 pl-0'>
            <div className='h-full w-full flex items-center justify-end bg-background'>
              <TooltipProvider delayDuration={350}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CopyIcon
                      onClick={() => {
                        navigator.clipboard.writeText(link);
                        toast({
                          title: 'Copied to clipboard:',
                          description: link,
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
