import Image from 'next/image';
import {useCallback, useEffect, useRef, useState} from 'react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {Dialog, DialogContent} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {uploadProfilePicKV} from '@/lib/server-actions/upload-profile-pic';
import {Avatar} from '@/components/ui/avatar';
import AvatarEdit from './avatar-editor';

import {useAuthStore} from '@/lib/hooks/useAuthStore';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';
import dataURLtoFile from '@/lib/convertToFile';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const formSchema = z.object({
  imgURL: z.coerce.string(),
  imgFile: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
});
export default function Modal({currentUserId}: {currentUserId: string}) {
  const {startOffset, scale, setScale, setStartOffset, img, setImg} = useProfilePicStore();
  const {updateProfilePic} = useAuthStore();
  const [avatarClick, setAvatarClick] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imgURL: '',
      imgFile: new File([], 'file'),
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // form to upload image strings or files
    console.log(values);
  }
  return (
    <>
      <Dialog open={avatarClick} onOpenChange={setAvatarClick}>
        <DialogContent>
          <AvatarEdit />
          <Button
            variant='outline'
            onClick={async () => {
              if (currentUserId === '') return;
              await uploadProfilePicKV(currentUserId, startOffset, scale, img);
              await updateProfilePic(img);
            }}
          >
            Update
          </Button>
          <Button onClick={async () => {}}>upload file</Button>
        </DialogContent>
      </Dialog>

      <Avatar className='w-24 h-24 cursor-pointer opacity-100 hover:opacity-75' onClick={() => setAvatarClick(true)}>
        <Image
          src={img}
          alt='user-profile-picture'
          width={96}
          height={96}
          priority
          style={{
            transform: `scale(${scale}) translate(${(startOffset.x / scale) * 0.11}px, ${
              (startOffset.y / scale) * 0.11
            }px)`,
          }}
        />
      </Avatar>
    </>
  );
}
