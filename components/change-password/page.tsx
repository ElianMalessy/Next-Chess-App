// import {useRef, useState} from 'react';
// import {Form, Button, Card, Alert} from 'react-bootstrap';
// // import {useAuth} from '../contexts/auth-provider';
// import {useAuthStore} from '@/hooks/useAuthStore';
// import {Link} from 'react-router-dom';

// export default function ChangePassword() {
//   const emailRef = useRef();
//   const {resetPassword} = useAuthStore();
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();

//     try {
//       setMessage('');
//       setError('');
//       setLoading(true);
//       await resetPassword(emailRef.current.value);
//       setMessage('Check your inbox for further instructions');
//     } catch (error) {
//       setError('Failed to reset password');
//     }

//     setLoading(false);
//   }

//   return (
//     <Card>
//       <Card.Body>
//         <h2 className='text-center mb-4'>Password Reset</h2>
//         {error && <Alert variant='danger'>{error}</Alert>}
//         {message && <Alert variant='success'>{message}</Alert>}
//         <Form onSubmit={handleSubmit}>
//           <Form.Group id='email'>
//             <Form.Label>Email</Form.Label>
//             <Form.Control type='email' ref={emailRef} required />
//           </Form.Group>
//           <Button disabled={loading} className='w-100' type='submit'>
//             Reset Password
//           </Button>
//         </Form>
//         <div className='w-100 text-center mt-3'>
//           <Link to='/login'>Login</Link>
//         </div>
//       </Card.Body>
//     </Card>
//   );
// }
