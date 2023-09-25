'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import {useToast} from '@/components/ui/use-toast';
import {Form, FormControl, FormField, FormItem, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Card, CardHeader, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Separator} from '@/components/ui/separator';

// import {useAuth} from '@/components/contexts/auth-provider';
import {useAuthStore} from '@/hooks/useAuthStore';
//import Background from './Background';

const formSchema = z.object({
  email: z.coerce.string().email(),
});

export default function Login() {
  const {anonSignup, googleSignIn, resetPassword} = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState('');
  const {toast} = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await resetPassword(values.email).catch((error) => {
      setError(error);
    });
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
              <div className='grid gap-2'>
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
                {error && (
                  <div className='border-destructive border-2 rounded-md text-center bg-background text-sm text-destructive p-1'>
                    {error}
                  </div>
                )}
                <Button
                  type='submit'
                  variant='outline'
                  className='w-full'
                  onClick={() => {
                    toast({
                      title: `To: ${form.getValues('email')}`,
                      description: 'Confirmation Email Sent',
                    });
                  }}
                >
                  Reset Password
                </Button>
              </div>
            </form>
          </Form>

          <Separator className='my-2' />

          <div className='grid grid-cols-3 grid-rows-1'>
            <Button variant={'link'} asChild>
              <Link href='/register'>Sign up</Link>
            </Button>
            <Button variant={'link'} asChild>
              <Link href='/login'>Log in</Link>
            </Button>
            <Button
              variant={'link'}
              onClick={async () => {
                await anonSignup();
                router.push('/');
              }}
            >
              Play as guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
