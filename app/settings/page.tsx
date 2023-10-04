'use client';
import Link from 'next/link';

import Navbar from '@/components/navbar/navbar';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import AvatarEdit from '../user/[id]/avatar-editor';
import UpdateProfile from './update-profile';
import {Separator} from '@/components/ui/separator';
export default function Page() {
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <div className='w-full flex items-center flex-col'>
          <Card>
            <CardContent>
              <AvatarEdit />
              <Separator className='my-2' />
              <UpdateProfile />
              <Link href='reset-password' />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
