'use client';
import {useState, useRef, useEffect, memo, useCallback} from 'react';
import {getStorage, ref, getDownloadURL, uploadBytesResumable} from '@firebase/storage';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import {Box, Button, Container, Flex, Spacer, useColorModeValue} from '@chakra-ui/react';

import ThemeToggleButton from './themeToggleButton';
import {useAuth} from './(contexts)/authContext';
import dataURLhrefFile, {toDataURL} from './modal/convertToFile';
import Board from './game/board';
//import Modal from './Modal/Modal';

export default memo(function Dashboard() {
  const [error, setError] = useState('');
  const {currentUser, logout, updateProfilePic} = useAuth();
  const router = useRouter();

  const gameID = useRef(Math.floor(Math.random() * 100 + 1));
  const [randomURL, setRandomURL] = useState('localhost:3000/Game/' + gameID.current);

  async function handleLogout() {
    setError('');
    try {
      await logout();
      await fetch('/api/logout', {
        method: 'GET',
      });
      console.log('logged out');
      router.push('/login');
    } catch (error) {
      console.log(error);
      setError('Failed href log out');
    }
  }

  // 'https://images.chesscomfiles.com/uploads/v1/news/133624.b2e6ae86.668x375o.9d61b2d492ec@2x.jpeg' <-- magnus carlsen pfp
  const [profilePic, setProfilePic] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Font_Awesome_5_solid_user-circle.svg/991px-Font_Awesome_5_solid_user-circle.svg.png'
  );
  const [hidden, setHidden] = useState(true);
  const [inputField, setInputField] = useState(false);

  const changeProfilePic = useCallback(
    (file: any) => {
      if (!currentUser) return;

      const storage = getStorage();
      const uploadTask = uploadBytesResumable(ref(storage, `profile-pictures/${currentUser.uid}.jpg`), file);
      uploadTask.on(
        'state_changed',
        (snapshot: any) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the hreftal number of bytes href be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error: any) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
            updateProfilePic(downloadURL);
          });
        }
      );
    },
    [currentUser, updateProfilePic]
  );

  useEffect(() => {
    const storage = getStorage();

    if (!currentUser) return;

    if (currentUser.photoURL) setProfilePic(currentUser.photoURL);
    else {
      getDownloadURL(ref(storage, `profile-pictures/${currentUser.uid}.jpg`))
        .then((url: string) => {
          setProfilePic(url);
        })
        .catch((error: any) => {
          const img =
            'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Font_Awesome_5_solid_user-circle.svg/991px-Font_Awesome_5_solid_user-circle.svg.png';
          setProfilePic(img);
          toDataURL(img).then((dataUrl: any) => {
            const fileData = dataURLhrefFile(dataUrl, `${currentUser.uid}.jpg`);
            changeProfilePic(fileData);
          });
        });
    }
  }, [currentUser, changeProfilePic]);

  const clickRef = useRef<any>();
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (clickRef.current && !clickRef.current.contains(event.target)) {
        setHidden(true);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clickRef]);

  return (
    <Flex
      h='100vh'
      w='100vw'
      bg={useColorModeValue('#f4ede4', '#202023')}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Flex
        position='fixed'
        as='nav'
        minWidth='100%'
        alignItems='start'
        gap='2'
        p='1rem 1rem 1rem 1rem'
        bg={useColorModeValue('#f4ede4', '#202023')}
        zIndex={1}
        top='0'
        justifyContent={'space-between'}
      >
        <Box w={'5rem'} h={'5rem'} position={'relative'} mixBlendMode={'multiply'} mt={'-0.5rem'}>
          <Image
            alt='logo'
            src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUZZloLNz2F11mD77ey5TLZezGlFueOWuFqw&usqp=CAU'}
            fill={true}
          />
        </Box>
        <Spacer />
        <Flex gap='2'>
          <Box>
            <Button border={'0.075rem solid #6c757d'} background={'inherit'}>
              Profile
            </Button>
          </Box>
          <ThemeToggleButton />
        </Flex>
      </Flex>

      <Box style={{width: '500px', height: '500px'}}>
        <Board />
      </Box>
      {/* <div>
        <svg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'>
          <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' />
        </svg>
      </div> */}
    </Flex>
  );
});
