import {validate} from 'uuid';

import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {getToken} from '@/lib/server-actions/get-current-user';
import Modal from './modal';
import getImageAspectRatio from '@/lib/server-actions/get-image-aspect-ratio';

export default async function UpdateAvatarEdit() {
  const token = await getToken();
  const currentUser = token?.decodedToken;
  const currentUserData = {
    photoURL: currentUser?.picture,
    scale: 1,
    startOffset: {x: 0, y: 0},
  };
  const aspectRatio = await getImageAspectRatio(currentUser?.picture ?? '');

  return (
    <div className='w-full flex items-center flex-col'>
      <Card className='flex flex-row items-center w-[50%] py-2'>
        <div className='ml-8'>
          <Modal
            token={token?.token ?? ''}
            currentUserId={currentUser?.uid ?? ''}
            currentUserData={currentUserData}
            aspectRatio={aspectRatio}
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
