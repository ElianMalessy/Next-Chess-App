'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';

import {zodResolver} from '@hookform/resolvers/zod';
import {Form, FormControl, FormField, FormItem, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Card, CardHeader, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';

// import {useAuth} from '@/components/contexts/auth-provider';
import {useAuthStore} from '@/lib/hooks/useAuthStore';
//import Background from './Background';

const formSchema = z
  .object({
    email: z.coerce.string().email(),
    password: z.coerce.string().min(6),
    confirm: z.coerce.string().min(6),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'],
  });

export default function Signup() {
  const {signup, anonSignup, googleSignIn} = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm: '',
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    signup(values.email, values.password)
      .catch((error: any) => {
        console.log(Object.keys(error), error.name, error.code);
        setError(error.code);
        return;
      })
      .then(() => router.push('/'));
  }
  return (
    <main className='h-full w-full flex items-center justify-center p-2'>
      <Card className='p-5'>
        <CardHeader className='w-full'>
          <div className='w-full'>
            <Button
              onClick={async () => {
                await googleSignIn();
                router.push('/');
              }}
              className='w-full'
            >
              Google
            </Button>
          </div>
        </CardHeader>
        <Separator className='my-2' />
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className='grid gap-6'>
                <div className='grid gap-4'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({field}) => (
                      <FormItem>
                        <FormControl>
                          <Input type='text' {...field} autoComplete='off' id='email' placeholder='Email' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormField
                      control={form.control}
                      name='password'
                      render={({field}) => (
                        <FormItem>
                          <FormControl>
                            <Input type='password' {...field} autoComplete='off' id='password' placeholder='Password' />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
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
                  Sign up
                </Button>
              </div>
            </form>
          </Form>

          <Separator className='my-2' />

          <div className='grid grid-cols-2 grid-rows-1'>
            <Button variant={'link'} asChild className='col-span-1'>
              <Link href='/login'>Log in</Link>
            </Button>
            <Button
              variant={'link'}
              onClick={async () => {
                await anonSignup();
                router.push('/');
              }}
              className='col-span-1'
            >
              Play as guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
