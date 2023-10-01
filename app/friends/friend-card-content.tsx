import {UserX, MessageSquarePlus, Swords} from 'lucide-react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from '@/components/ui/tooltip';

import {CardContent} from '@/components/ui/card';
import removeFriend from '@/lib/server-actions/remove-friend';

export default function FriendCardContent({currentUser, friend}: {currentUser: any; friend: any}) {
  return (
    <CardContent className='w-full flex gap-2'>
      <TooltipProvider delayDuration={350}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Swords strokeWidth={1} />
          </TooltipTrigger>
          <TooltipContent>
            <p>challenge</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={350}>
        <Tooltip>
          <TooltipTrigger asChild>
            <MessageSquarePlus strokeWidth={1} />
          </TooltipTrigger>
          <TooltipContent>
            <p>message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={350}>
        <Tooltip>
          <TooltipTrigger asChild>
            <UserX strokeWidth={1} onClick={() => removeFriend(currentUser, friend)} />
          </TooltipTrigger>
          <TooltipContent>
            <p>unfriend</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </CardContent>
  );
}
