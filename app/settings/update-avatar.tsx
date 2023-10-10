import {kv} from '@vercel/kv';
import {validate} from 'uuid';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import getCurrentUser from '@/lib/server-actions/get-current-user';
import Modal from './modal';
const probe = require('probe-image-size');

export default async function UpdateAvatarEdit() {
  const currentUser = await getCurrentUser();
  const currentUserData = await kv.hgetall(currentUser?.uid ?? '');
  let result = await probe(currentUser?.picture);
  const width = result.width;
  const height = result.height;

  return (
    <div className='w-full flex items-center flex-col'>
      <Card className='flex flex-row items-center w-[50%] py-2'>
        <div className='ml-8'>
          <Modal
            currentUserId={currentUser?.uid ?? ''}
            currentUserData={currentUserData}
            aspectRatio={width && height ? width / height : 1}
          />
        </div>
        <div>
          <CardHeader>
            <CardTitle>
              {currentUser?.name
                ? validate(currentUser?.name)
                  ? `anonymous (${currentUser?.name})`
                  : currentUser?.name
                : 'user'}
            </CardTitle>
          </CardHeader>
        </div>
      </Card>
    </div>
  );
}
