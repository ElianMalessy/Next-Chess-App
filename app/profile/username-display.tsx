'use client';
import { validate } from 'uuid';
import { CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/lib/hooks/useAuthStore';

export default function UsernameDisplay() {
  const { currentUser } = useAuthStore();
  
  return (
    <CardTitle className='text-base'>
      {currentUser?.displayName
        ? validate(currentUser.displayName)
          ? `anonymous (${currentUser.displayName})`
          : currentUser.displayName
        : 'user'}
    </CardTitle>
  );
}