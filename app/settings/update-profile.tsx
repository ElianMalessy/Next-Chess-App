'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import {useAuthStore} from '@/lib/hooks/useAuthStore';
import {Card, CardDescription, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {deleteUser} from '@/lib/server-actions/delete-user';

const emailPasswordFormSchema = z
  .object({
    email: z.coerce.string().email(),
    password: z.coerce.string().min(6),
    confirm: z.coerce.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  });
const passwordFormSchema = z
  .object({
    password: z.coerce.string().min(6),
    confirm: z.coerce.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  });
const usernameFormSchema = z.object({
  username: z.coerce.string().min(3, 'Username must be at least 3 characters'),
});

export default function UpdateProfile() {
  const router = useRouter();
  const {deleteCurrentUser, updateProfilePic, updateUsername, currentUser} = useAuthStore();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const usernameForm = useForm<z.infer<typeof usernameFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      username: '',
    },
  });

  function onUsernameFormSubmit(values: z.infer<typeof usernameFormSchema>) {
    setLoading(true);
    updateUsername(values.username)
      .catch((error: any) => {
        console.log(Object.keys(error), error.name, error.code);
        setError(error.code);
        return;
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Card className='w-full my-4'>
        <CardHeader className='p-2'>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardTitle></CardTitle>

        <CardContent className='p-2 grid gap-8'>
          <Form {...usernameForm}>
            <form onSubmit={usernameForm.handleSubmit(onUsernameFormSubmit)}>
              <div className='grid gap-6'>
                <FormField
                  control={usernameForm.control}
                  name='username'
                  render={({field}) => (
                    <FormItem>
                      <FormLabel htmlFor='username'>Change Username</FormLabel>
                      <FormControl>
                        <Input type='text' {...field} autoComplete='off' id='username' placeholder='Username' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <div className='border-destructive border-2 rounded-md text-center bg-background text-sm text-destructive p-1'>
                    {error}
                  </div>
                )}
                <Button type='submit' variant={'outline'} className='w-full' disabled={loading}>
                  Update
                </Button>
              </div>
            </form>
          </Form>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='outline' disabled={loading}>
                Delete User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    if (!currentUser || !currentUser?.displayName || !currentUser?.photoURL) return;
                    setLoading(true);
                    await deleteCurrentUser();
                    await deleteUser(currentUser?.uid, currentUser?.displayName, currentUser?.photoURL);
                    setLoading(false);
                    router.push('/login');
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </>
  );
}
