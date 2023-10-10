'use client';
import Image from 'next/image';
import {useState} from 'react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {getStorage, ref, getDownloadURL, uploadBytes} from '@firebase/storage';

import {Dialog, DialogContent} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {uploadProfilePicKV} from '@/lib/server-actions/upload-profile-pic';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import AvatarEdit from './avatar-editor';
import {FileController} from './file-controller';

import {useAuthStore} from '@/lib/hooks/useAuthStore';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';
import dataURLtoFile from '@/lib/convertToFile';

const formSchema = z.object({
  imgURL: z.coerce.string(),
  imgFile: z.any(),
});
export default function Modal({
  currentUserId,
  aspectRatio,
  currentUserData,
}: {
  currentUserId: string;
  aspectRatio: number;
  currentUserData: any;
}) {
  const {updateProfilePic} = useAuthStore();
  const {startOffset, scale, img, setImg} = useProfilePicStore();
  const serverScale = scale ?? currentUserData.scale;
  const serverStartOffset = startOffset ?? currentUserData;
  const serverImg = img ?? currentUserData.photoURL;

  const [avatarClick, setAvatarClick] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imgURL: '',
      imgFile: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // form to upload image strings or files
    if ((values.imgFile.length === 0 || values.imgFile.size === 0) && values.imgURL === '') return;

    const storage = getStorage();
    const storageRef = ref(storage, `profile-pics/${currentUserId}`);
    let file = values.imgFile ? values.imgFile[0] : dataURLtoFile(values.imgURL, 'profile-pic');

    uploadBytes(storageRef, file).then(async (snapshot) => {
      const imgURLFromFirebase: any = await getDownloadURL(snapshot.ref);
      await updateProfilePic(imgURLFromFirebase);
      await uploadProfilePicKV(currentUserId, startOffset, scale, imgURLFromFirebase);
      setImg(imgURLFromFirebase);
    });
  }

  return (
    <>
      <Dialog open={avatarClick} onOpenChange={setAvatarClick}>
        <DialogContent>
          <AvatarEdit aspectRatio={aspectRatio} currentUserData={currentUserData} currentUserId={currentUserId} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
              <FormField
                control={form.control}
                name='imgURL'
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Image link:</FormLabel>
                    <FormControl>
                      <Input placeholder='paste your link here' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FileController name='imgFile' errors={form.formState.errors} register={form.register} />
              <Button type='submit'>Update</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div
        className='w-[96px] h-[96px] overflow-hidden cursor-pointer opacity-100 hover:opacity-75 rounded-full relative'
        onClick={() => setAvatarClick(true)}
      >
        <Image
          src={serverImg}
          alt='user-profile-picture'
          fill
          objectFit='contain'
          style={{
            transform: `scale(${serverScale}) translate(${serverStartOffset.x * (96 / 288)}px, ${
              (serverStartOffset.y / serverScale) * (96 / 288)
            }px)`,
          }}
        />
      </div>
    </>
  );
}
