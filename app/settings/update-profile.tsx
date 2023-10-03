'use client';
import {useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {GoogleAuthProvider, EmailAuthProvider} from '@firebase/auth';

import {useAuthStore} from '@/lib/hooks/useAuthStore';
import {Card} from '@/components/ui/card';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';

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
const usernameFormSchema = z.object({
  username: z.coerce.string().min(3, 'Username must be at least 3 characters'),
});

export default function UpdateProfile() {
  const {
    deleteCurrentUser,
    updateUserPassword,
    updateProfilePic,
    updateUsername,
    currentUser,
    upgradeUserFromAnonymous,
  } = useAuthStore();

  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<HTMLInputElement>();
  const passwordConfirmRef = useRef<HTMLInputElement>();

  const emailPasswordForm = useForm<z.infer<typeof emailPasswordFormSchema>>({
    resolver: zodResolver(emailPasswordFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm: '',
    },
  });

  const usernameForm = useForm<z.infer<typeof usernameFormSchema>>({
    resolver: zodResolver(emailPasswordFormSchema),
    defaultValues: {
      username: '',
    },
  });

  function onUsernameFormSubmit(values: z.infer<typeof usernameFormSchema>) {
    updateUsername(values.username);
  }
  function onEmailPasswordFormSubmit(values: z.infer<typeof emailPasswordFormSchema>) {
    if (!currentUser?.email && values.email) {
      setError('Must have a permanent account');
      setOpenDialog(true);
      return;
    }

    const promises = [];
    setLoading(true);
    setError('');

    if (values.email && values.email !== currentUser?.email) {
      promises.push(updateUsername(values.email));
    }
    if (values.password) {
      promises.push(updateUserPassword(values.password));
    }

    Promise.all(promises)
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Card>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Permanent Account Needed</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Card>
          <h2 className='text-center mb-4'>Update Profile</h2>
          {error && <h1>{error}</h1>}
          <div className='grid gap-4'>
            <Form {...usernameForm}>
              <form onSubmit={usernameForm.handleSubmit(onUsernameFormSubmit)}>
                <FormField
                  control={usernameForm.control}
                  name='username'
                  render={({field}) => (
                    <FormItem>
                      <FormControl>
                        <Input type='text' {...field} autoComplete='off' id='email' placeholder='Email' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <Form {...emailPasswordForm}>
              <form onSubmit={emailPasswordForm.handleSubmit(onEmailPasswordFormSubmit)}>
                <div className='grid gap-6'>
                  <div className='grid gap-4'>
                    <FormField
                      control={emailPasswordForm.control}
                      name='email'
                      render={({field}) => (
                        <FormItem>
                          <FormControl>
                            <Input type='text' {...field} autoComplete='off' id='username' placeholder='Username' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <FormField
                        control={emailPasswordForm.control}
                        name='password'
                        render={({field}) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type='password'
                                {...field}
                                autoComplete='off'
                                id='password'
                                placeholder='Password'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={emailPasswordForm.control}
                        name='confirm'
                        render={({field}) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type='password'
                                {...field}
                                autoComplete='off'
                                id='confirm'
                                placeholder='Password Confirmation'
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {error && (
                    <div className='border-destructive border-2 rounded-md text-center bg-background text-sm text-destructive p-1'>
                      {error}
                    </div>
                  )}
                  <Button type='submit' variant={'outline'} className='w-full'>
                    Update
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </Card>
      </Card>
    </>
  );
}
