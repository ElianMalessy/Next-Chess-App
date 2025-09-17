'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore } from '@/lib/hooks/useAuthStore';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  username: z.coerce.string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^\S+$/, 'Username cannot contain spaces'),
});

export default function UpdateProfile() {
  const router = useRouter();
  const { deleteCurrentUser, updateUsername, currentUser } = useAuthStore();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const usernameForm = useForm<z.infer<typeof usernameFormSchema>>({
    resolver: zodResolver(usernameFormSchema),
    defaultValues: {
      username: '',
    },
  });

  function onUsernameFormSubmit(values: z.infer<typeof usernameFormSchema>) {
    if (!currentUser) return;
    setLoading(true);

    updateUsername(values.username)
      .catch((error: any) => {
        console.log(Object.keys(error), error.name, error.code);
        setError(error.code);
        return;
      })
      .then(() => Promise.resolve())
      .finally(() => setLoading(false));
  }

  return (
    <div className='space-y-6'>
      {/* Username Update Section */}
      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>Update Username</h3>
        <Form {...usernameForm}>
          <form onSubmit={usernameForm.handleSubmit(onUsernameFormSubmit)} className='space-y-4'>
            <FormField
              control={usernameForm.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='username'>New Username</FormLabel>
                  <FormControl>
                    <Input 
                      type='text' 
                      {...field} 
                      autoComplete='off' 
                      id='username' 
                      placeholder='Enter new username (no spaces allowed)' 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <div className='border-destructive border rounded-md text-center bg-destructive/10 text-sm text-destructive p-3'>
                {error}
              </div>
            )}
            <Button 
              type='submit' 
              className='w-full' 
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Username'}
            </Button>
          </form>
        </Form>
      </div>

      {/* Danger Zone */}
      <div className='border-t pt-6'>
        <h3 className='text-lg font-medium text-destructive mb-4'>Danger Zone</h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant='outline' 
              className='border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground' 
              disabled={loading}
            >
              Delete Account
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
                  // User deletion now handled by Firebase auth only
                  setLoading(false);
                  router.push('/login');
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
