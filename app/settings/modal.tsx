'use client';
import Image from 'next/image';
import {useCallback, useEffect, useRef, useState} from 'react';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import {Dialog, DialogContent} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {uploadProfilePicKV} from '@/lib/server-actions/upload-profile-pic';
import {Avatar} from '@/components/ui/avatar';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import AvatarEdit from './avatar-editor';

import {useAuthStore} from '@/lib/hooks/useAuthStore';
import {useProfilePicStore} from '@/lib/hooks/useProfilePicStore';
import {toDataURL} from '@/lib/convertToFile';
import {FileController} from './file-controller';

const formSchema = z.object({
  imgURL: z.coerce.string(),
  imgFile: z.instanceof(File),
});
export default function Modal({currentUserId}: {currentUserId: string}) {
  const {startOffset, scale, setScale, setStartOffset, img, setImg} = useProfilePicStore();
  const {updateProfilePic} = useAuthStore();
  const [avatarClick, setAvatarClick] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imgURL: '',
      imgFile: new File([], ''),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // form to upload image strings or files
    console.log(values.imgFile);
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
            Edit
          </Button>
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
              <FileController
                name='imgFile'
                control={form.control}
                defaultValue={new File([], '')}
                render={({field, base64, remove, select}: any) => (
                  <FormItem>
                    <FormLabel>Upload file:</FormLabel>
                    <FormControl>
                      {base64 ? (
                        <>
                          <Image src={base64} width={100} alt='preview-profile-pic' />
                          <button onClick={remove}>remove</button>
                        </>
                      ) : (
                        <>
                          <input {...field} />
                          <br />
                          <button onClick={select}>select</button>
                          &nbsp;&lt;--- alternative (if input is hidden)
                        </>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit'>Update</Button>
            </form>
          </Form>
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
