import Link from 'next/link';

import Navbar from '@/components/navbar/navbar';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import UpdateProfile from './update-profile';
import {Separator} from '@/components/ui/separator';
import UpdateAvatarEdit from './update-avatar';
export default function Page() {
  return (
    <>
      <Navbar />
      <main className='p-2'>
        <div className='w-full flex items-center flex-col'>
          <Card>
            <CardContent className='2xs:w-[95vw] sm:w-[75vw] lg:w-[55vw] p-2'>
              <UpdateAvatarEdit />
              <UpdateProfile />
              <Link href='reset-password' />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
