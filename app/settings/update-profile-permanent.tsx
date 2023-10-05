// 'use client';
// import {useRef, useState} from 'react';
// import {useForm} from 'react-hook-form';
// import * as z from 'zod';
// import {zodResolver} from '@hookform/resolvers/zod';
// import {GoogleAuthProvider, EmailAuthProvider, signInWithPopup} from '@firebase/auth';

// import {useAuthStore} from '@/lib/hooks/useAuthStore';
// import {Card, CardDescription, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
// import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
// import {Input} from '@/components/ui/input';
// import {Button} from '@/components/ui/button';
// import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import {Separator} from '@/components/ui/separator';
// import {auth} from '@/components/firebase';

// const emailPasswordFormSchema = z
//   .object({
//     email: z.coerce.string().email(),
//     password: z.coerce.string().min(6),
//     confirm: z.coerce.string().min(6),
//   })
//   .refine((data) => data.password === data.confirm, {
//     message: "Passwords don't match",
//     path: ['confirm'],
//   });
// const passwordFormSchema = z
//   .object({
//     password: z.coerce.string().min(6),
//     confirm: z.coerce.string().min(6),
//   })
//   .refine((data) => data.password === data.confirm, {
//     message: "Passwords don't match",
//     path: ['confirm'],
//   });
// const usernameFormSchema = z.object({
//   username: z.coerce.string().min(3, 'Username must be at least 3 characters'),
// });

// export default function UpdateProfile() {
//   const {
//     deleteCurrentUser,
//     updateUserPassword,
//     updateProfilePic,
//     updateUsername,
//     currentUser,
//     upgradeUserFromAnonymous,
//     googleSignIn,
//   } = useAuthStore();

//   const [openDialog, setOpenDialog] = useState(false);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
//     resolver: zodResolver(passwordFormSchema),
//     defaultValues: {
//       password: '',
//       confirm: '',
//     },
//   });

//   const usernameForm = useForm<z.infer<typeof usernameFormSchema>>({
//     resolver: zodResolver(passwordFormSchema),
//     defaultValues: {
//       username: '',
//     },
//   });

//   const permanentAccountForm = useForm<z.infer<typeof emailPasswordFormSchema>>({
//     resolver: zodResolver(emailPasswordFormSchema),
//     defaultValues: {
//       email: '',
//       password: '',
//       confirm: '',
//     },
//   });
//   function onPermanentAccountFormSubmit(values: z.infer<typeof emailPasswordFormSchema>) {
//     if (!currentUser) return;
//     const credential = EmailAuthProvider.credential(values.email, values.password);
//     upgradeUserFromAnonymous(currentUser, credential);
//   }

//   function onUsernameFormSubmit(values: z.infer<typeof usernameFormSchema>) {
//     updateUsername(values.username).finally(() => setLoading(false));
//   }
//   function onPasswordFormSubmit(values: z.infer<typeof passwordFormSchema>) {
//     if (!currentUser?.email && values.password) {
//       setError('Must have a permanent account');
//       setOpenDialog(true);
//       return;
//     }
//     setLoading(true);
//     setError('');

//     if (values.password) {
//       updateUserPassword(values.password).finally(() => setLoading(false));
//     }
//   }

//   return (
//     <>
//       {/* <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogHeader>
//           <DialogTitle>
//             {currentUser?.uid && !currentUser?.email && (
//               <Button variant='ghost' onClick={() => setOpenDialog(true)}>
//                 Convert anonymous account to permanent account
//               </Button>
//             )}
//           </DialogTitle>
//         </DialogHeader>

//         <DialogContent className='p-2'> */}
//       {/* <div className='w-full px-6'>
//             <Button
//               onClick={() => {
//                 if (!currentUser) return;
//                 const provider = new GoogleAuthProvider();
//                 provider.addScope('profile');
//                 provider.addScope('email');

//                 signInWithPopup(auth, provider).then((result) => {
//                   const credential = GoogleAuthProvider.credential(result._tokenResponse.oauthIdToken);
//                   console.log(result, credential);
//                   upgradeUserFromAnonymous(currentUser, credential);
//                 });
//               }}
//             >
//               Google
//             </Button>
//           </div> */}
//       {/* <Separator className='my-2' /> */}
//       {/*
//           <Form {...permanentAccountForm}>
//             <form onSubmit={permanentAccountForm.handleSubmit(onPermanentAccountFormSubmit)}>
//               <div className='grid gap-6'>
//                 <div className='grid gap-4'>
//                   <FormField
//                     control={permanentAccountForm.control}
//                     name='email'
//                     render={({field}) => (
//                       <FormItem>
//                         <FormControl>
//                           <Input type='text' {...field} autoComplete='off' id='email' placeholder='Email' />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <div>
//                     <FormField
//                       control={permanentAccountForm.control}
//                       name='password'
//                       render={({field}) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input type='password' {...field} autoComplete='off' id='password' placeholder='Password' />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={permanentAccountForm.control}
//                       name='confirm'
//                       render={({field}) => (
//                         <FormItem>
//                           <FormControl>
//                             <Input
//                               type='password'
//                               {...field}
//                               autoComplete='off'
//                               id='confirm'
//                               placeholder='Password Confirmation'
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//                 {error && (
//                   <div className='border-destructive border-2 rounded-md text-center bg-background text-sm text-destructive p-1'>
//                     {error}
//                   </div>
//                 )}
//                 <Button type='submit' variant={'outline'} className='w-full'>
//                   Create
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </DialogContent>
//       </Dialog> */}
//       <Card className='w-full my-4'>
//         <CardHeader className='p-2'>
//           <CardTitle>Update Profile</CardTitle>
//           <h1>{error}</h1>
//         </CardHeader>
//         <CardTitle></CardTitle>

//         <CardContent className='p-2 grid gap-8'>
//           <Form {...usernameForm}>
//             <form onSubmit={usernameForm.handleSubmit(onUsernameFormSubmit)}>
//               <div className='grid gap-6'>
//                 <FormField
//                   control={usernameForm.control}
//                   name='username'
//                   render={({field}) => (
//                     <FormItem>
//                       <FormLabel>Change Username</FormLabel>
//                       <FormControl>
//                         <Input type='text' {...field} autoComplete='off' id='username' placeholder='Username' />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 {error && (
//                   <div className='border-destructive border-2 rounded-md text-center bg-background text-sm text-destructive p-1'>
//                     {error}
//                   </div>
//                 )}
//                 <Button type='submit' variant={'outline'} className='w-full' disabled={loading}>
//                   Update
//                 </Button>
//               </div>
//             </form>
//           </Form>
//           {/* <Form {...passwordForm}>
//             <form onSubmit={passwordForm.handleSubmit(onPasswordFormSubmit)}>
//               <div className='grid gap-6'>
//                 <div className='grid gap-2'>
//                   <FormField
//                     control={passwordForm.control}
//                     name='password'
//                     render={({field}) => (
//                       <FormItem>
//                         <FormLabel>Change Password</FormLabel>
//                         <FormControl>
//                           <Input type='password' {...field} autoComplete='off' id='password' placeholder='Password' />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={passwordForm.control}
//                     name='confirm'
//                     render={({field}) => (
//                       <FormItem>
//                         <FormControl>
//                           <Input
//                             type='password'
//                             {...field}
//                             autoComplete='off'
//                             id='confirm'
//                             placeholder='Password Confirmation'
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//                 {error && (
//                   <div className='border-destructive border-2 rounded-md text-center bg-background text-sm text-destructive p-1'>
//                     {error}
//                   </div>
//                 )}
//                 <Button type='submit' variant={'outline'} className='w-full' disabled={loading}>
//                   Update
//                 </Button>
//               </div>
//             </form>
//           </Form> */}
//           <Button onClick={()}>
//             delete user
//           </Button>
//         </CardContent>
//       </Card>
//     </>
//   );
// }
