'use client';
import {useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/navigation';
import {FormControl, FormLabel, Input, Card, Container, Button, Link, Box} from '@chakra-ui/react';

import {useAuth} from '../(contexts)/AuthContext';
//import Background from './Background';

export default function Login() {
  const {login, anonSignup, googleSignIn} = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <Container className='h-screen w-screen flex items-center justify-center'>
      <Card p={5}>
        <Box mb='1rem'>
          <form
            onSubmit={async () => {
              await login(email, password);
              router.push('/');
            }}
          >
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input paddingLeft={2} type='email' onChange={(e) => setEmail(e.target.value)} autoComplete='off' />
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Password</FormLabel>
              <Input type='password' size='lg' onChange={(e) => setPassword(e.target.value)} autoComplete='off' />
            </FormControl>
            <Box>
              <Link as={NextLink} href='/' color={'blue.400'} fontSize='xs'>
                Forgot Password
              </Link>
            </Box>
            <Button mt={4} colorScheme='teal' type='submit' w='100%'>
              Log In
            </Button>
          </form>
        </Box>
        <hr />
        <Box mt='1rem'>
          <Button
            onClick={async () => {
              await anonSignup();
              router.push('/');
            }}
          >
            Play as guest
          </Button>
        </Box>
        <Box>
          <Button
            onClick={async () => {
              await googleSignIn();
              router.push('/');
            }}
          >
            Google
          </Button>
        </Box>
      </Card>
    </Container>
  );
}
