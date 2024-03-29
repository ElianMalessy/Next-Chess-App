'use client';
import Image from 'next/image';
import {useState, useEffect} from 'react';
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

import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';
import dataURLtoFile, {urlToFile, toDataURL} from '@/lib/convertToFile';
import getImageAspectRatio from '@/lib/server-actions/get-image-aspect-ratio';

const formSchema = z.object({
  imgURL: z.coerce.string(),
  imgFile: z.any(),
});
export default function Modal({
  currentUserId,
  aspectRatio,
  currentUserData,
  token,
}: {
  currentUserId: string;
  aspectRatio: number;
  currentUserData: any;
  token: string;
}) {
  const {startOffset, scale, img, setImg, setScale, setStartOffset} = useProfilePicStore();

  useEffect(() => {
    setScale(currentUserData.scale);
    setStartOffset(currentUserData.startOffset);
    setImg(currentUserData.photoURL);
  }, [currentUserData, setScale, setStartOffset, setImg]);

  const [avatarClick, setAvatarClick] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imgURL: '',
      imgFile: undefined,
    },
  });
  const {formState} = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // form to upload image strings or files
    if ((values.imgFile.length === 0 || values.imgFile.size === 0) && values.imgURL === '') return;

    const storage = getStorage();
    const storageRef = ref(storage, `profile-pics/${currentUserId}`);

    let file = values.imgFile[0];
    if (values.imgURL && values.imgURL.startsWith('data:image/')) {
      file = dataURLtoFile(values.imgURL, 'profile-pic');
    } else if (values.imgURL && values.imgURL.startsWith('http')) {
      file = await urlToFile(values.imgURL);
    }

    uploadBytes(storageRef, file).then(async (snapshot) => {
      const imgURLFromFirebase: any = await getDownloadURL(snapshot.ref);
      await fetch(window.location.origin + `/api/update-profile-pic?imgURL=${encodeURIComponent(imgURLFromFirebase)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const aspectRatio = await getImageAspectRatio(imgURLFromFirebase);
      await uploadProfilePicKV(currentUserId, startOffset, aspectRatio, imgURLFromFirebase);
      setImg(imgURLFromFirebase);
      setScale(aspectRatio);
      setStartOffset({x: 0, y: 0});
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
                      <Input
                        placeholder='Paste your link here'
                        {...field}
                        autoComplete='off'
                        onChange={async (e) => {
                          // field.onChange((event: any) => {
                          //   console.log(e.target.value, event);
                            const url = e.target.value;
                            const dataURL = await toDataURL(url);
                            const aspectRatio = await getImageAspectRatio(url);
                            setImg(dataURL);
                            setScale(aspectRatio);
                            setStartOffset({x: 0, y: 0});
                          // });
                        }}
                      />
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
          src={img}
          alt='user-profile-picture'
          fill
          style={{
            objectFit: 'cover',
            transform: `scale(${scale}) translate(${startOffset.x * (96 / 288)}px, ${
              (startOffset.y / scale) * (96 / 288)
            }px)`,
          }}
        />
      </div>
    </>
  );
}
