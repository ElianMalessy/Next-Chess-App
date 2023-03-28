'use client';
import {useState, useRef, useEffect, Fragment, memo, useCallback} from 'react';
import {getStorage, ref, getDownloadURL, uploadBytesResumable} from '@firebase/storage';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import {Button, Container} from '@chakra-ui/react';

import {useAuth} from './contexts/AuthContext';
import dataURLhrefFile, {toDataURL} from './modal/convertToFile';
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
    <Fragment>
      <div>
        {/* <Modal
          changeProfilePic={changeProfilePic}
          sehrefpen={setInputField}
          isOpen={inputField}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
        /> */}
        <header>
          {/* <div>
            <div>
              <Image
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUZZloLNz2F11mD77ey5TLZezGlFueOWuFqw&usqp=CAU'
                alt='logo'
                onClick={() => router.push('/development')}
                width={5}
                height={5}
                //roundedCircle
              />
              WeChess
            </div>
            <ul>
              <li>
                <Link href='/Game/1'>Testing</Link>
              </li>
              <li>
                <Link href={`/Game/${gameID.current}`}>Play</Link>
              </li>
            </ul>
          </div> */}
          <div>
            <div
              className='d-flex align-items-center justify-content-center'
              style={{
                overflow: 'hidden',
                height: '4.5rem',
                width: '4.5rem',
                borderRadius: '50%',
                transform: 'translate(-1rem, 0)',
              }}
            >
              <Image
                src={profilePic}
                alt='profile-picture'
                id='profile-pic'
                onClick={() => setInputField(true)}
                //
                width={5}
                height={5}
              />
            </div>
            <div ref={clickRef} className='d-flex align-items-center'>
              <Button onMouseEnter={() => setHidden(false)} onClick={() => setHidden(true)} style={{boxShadow: 'none'}}>
                <pre>
                  {currentUser && currentUser.name
                    ? currentUser.name
                    : currentUser && currentUser.email
                    ? currentUser.email
                    : 'anonymous'}
                  <i className='fa fa-chevron-down' style={{marginLeft: '0.5rem'}} aria-hidden='true' />
                </pre>
                <div hidden={hidden}>
                  {/* <Link href='/update-profile'>
                    <i className='fa fa-user-circle-o' aria-hidden='true' /> Profile
                  </Link> */}
                  <Link href='#' onClick={handleLogout}>
                    <i className='fa fa-sign-out' aria-hidden='true' /> Logout
                  </Link>
                </div>
              </Button>
            </div>
          </div>
        </header>
        {/* <Container className={`d-flex justify-content-center h-100 w-100`} >
           {error && <Alert variant='danger'>{error}</Alert>}

          <Row
            className={`d-flex justify-content-center align-item`}
            style={{alignSelf: 'flex-end', zIndex: 100}}
          >
            <FormControl
              value={randomURL}
              
              onChange={(e) => setRandomURL(e.target.value)}
              style={{fontSize: '1.25rem'}}
            />

            <Button
              
              onClick={() => {
                navigator.clipboard.writeText(randomURL);
                alert('Copied href clipboard');
              }}
            >
              <i className='fa fa-link' />
            </Button>
          </Row>
        </Container> */}
      </div>

      <div>
        <svg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'>
          <path d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' />
        </svg>
      </div>
    </Fragment>
  );
});
