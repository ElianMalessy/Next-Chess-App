// 'use client';
// import {Fragment, useRef, useState} from 'react';
// import {useRouter} from 'next/router';

// export default function UpdateProfile() {
//   const userNameRef = useRef<any>();
//   const passwordRef = useRef<any>();
//   const passwordConfirmRef = useRef<any>();
//   //const {user, updatePassword, updateUsername} = useAuthStore();
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const router = useRouter();

//   function handleSubmit(e: Event) {
//     e.preventDefault();
//     if (
//       passwordRef.current &&
//       passwordConfirmRef.current &&
//       passwordRef.current.value !== passwordConfirmRef.current.value
//     ) {
//       return setError('Passwords do not match');
//     }

//     const promises = [];
//     setLoading(true);
//     setError('');

//     if (userNameRef.current && userNameRef.current.value !== user?.email) {
//       promises.push(updateUsername(userNameRef.current.value));
//     }
//     if (passwordRef.current.value) {
//       promises.push(updatePassword(passwordRef.current.value));
//     }

//     Promise.all(promises)
//       .then(() => {
//         router.push('/');
//       })
//       .catch((error) => {
//         console.log(error);
//         setError('Failed to update account');
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }

//   return (
//     <Fragment>
//       <Card>
//         <Card.Body>
//           <h2 className='text-center mb-4'>Update Profile</h2>
//           {error && <Alert variant='danger'>{error}</Alert>}
//           <Form onSubmit={handleSubmit}>
//             <Form.Group id='email'>
//               <Form.Label>Username</Form.Label>
//               <Form.Control
//                 type='text'
//                 ref={userNameRef}
//                 required
//                 defaultValue={
//                   currentUser.displayName
//                     ? currentUser.displayName
//                     : currentUser.email
//                     ? currentUser.email
//                     : 'anonymous'
//                 }
//                 maxLength='20'
//               />
//             </Form.Group>
//             <Form.Group id='password'>
//               <Form.Label>Password</Form.Label>
//               <Form.Control type='password' ref={passwordRef} placeholder='Leave blank to keep the same' />
//             </Form.Group>
//             <Form.Group id='password-confirm'>
//               <Form.Label>Password Confirmation</Form.Label>
//               <Form.Control type='password' ref={passwordConfirmRef} placeholder='Leave blank to keep the same' />
//             </Form.Group>
//             <Button disabled={loading} className='w-100' type='submit'>
//               Update
//             </Button>
//           </Form>
//         </Card.Body>
//       </Card>
//       <div className='w-100 text-center mt-2'>
//         <Link to='/'>Cancel</Link>
//       </div>
//     </Fragment>
//   );
// }
