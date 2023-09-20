// 'use client';

// import Image from 'next/image';
// import {kv} from '@vercel/kv';
// import {useEffect, useLayoutEffect, useState} from 'react';

// import {UserX, MessageSquarePlus, Swords} from 'lucide-react';
// import {collection, getDocs, query, where, documentId, limit, doc, getDoc, QuerySnapshot} from '@firebase/firestore';
// import {getFirebaseAuth} from 'next-firebase-auth-edge/lib/auth';

// import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
// import {Avatar} from '@/components/ui/avatar';
// import {firestore} from '@/components/firebase';

// import NonGameBoard from '@/components/board/non-game-board';
// import Client from './client';
// import getCurrentUser from '@/components/server-actions/getCurrentUser';
// import {useAuth} from '@/components/contexts/auth-provider';

// export default function Server({username}: {username: string}) {
//   const {currentUser} = useAuth();

//   const [userImg, setUserImg] = useState('');
//   const [alert, setAlert] = useState('');
//   const [userEmail, setUserEmail] = useState('');

//   const [since, setSince] = useState('');
//   const [isFriend, setIsFriend] = useState(false);
//   const [userExists, setUserExists] = useState(true);

//   useLayoutEffect(() => {
//     (async () => {
//       if (!currentUser?.email) return;
//       if (username !== currentUser?.displayName) {
//         // const friends: any = await kv.get(`${currentUser?.email}/friends`);
//         // for (let i = 0; i < friends.length; i++) {
//         //   if (friends[i].username === username) {
//         //     setUserImg(friends[i].profilePic);
//         //     setAlert(`You are already friends with ${username}`);
//         //     setIsFriend(true);
//         //     break;
//         //   }
//         // }
//         const q = query(collection(firestore, 'users'), where('username', '==', username), limit(1));
//         const querySnapshot = await getDocs(q);
//         if (querySnapshot.empty) {
//           setUserExists(false);
//           return;
//         }
//         const docSnap = querySnapshot.docs[0];

//         setUserImg(docSnap.data().profilePic);
//         setUserEmail(docSnap.id);
//         const userRef = doc(firestore, 'users', docSnap.id, 'friends', currentUser?.email);
//         const userDocSnap = await getDoc(userRef);
//         if (userDocSnap.exists()) {
//           setIsFriend(true);
//           setSince(new Date(userDocSnap.data().since?.seconds * 1000).toString());
//         }
//       }
//     })();
//   }, [currentUser?.displayName, username, currentUser?.email]);

//   const img = username === currentUser?.displayName ? currentUser.photoURL : userImg;
//   const defaultImg =
//     'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a';
//   return (
//     <>
//       {!userExists ? (
//         <div className='w-[calc(100vw-1rem)] flex items-center flex-col gap-2'>
//           <div className='text-2xl'>404 - User Not Found</div>
//           <div className='relative h-[min(560px,95vw)] w-[min(560px,95vw)]'>
//             <NonGameBoard />
//           </div>
//         </div>
//       ) : (
//         <div className='w-full flex items-center flex-col'>
//           {/* {isFriend && <Client username={username} alert={alert} userEmail={userEmail} currentUser={currentUser} />} */}
//           <Card className='flex flex-row items-center w-[50%]'>
//             <div className='ml-8'>
//               <Avatar className='w-24 h-24'>
//                 <Image src={img || defaultImg} alt='currentUser-profile-picture' width={96} height={96} priority />
//               </Avatar>
//             </div>
//             <div>
//               <CardHeader>
//                 <CardTitle>{username || 'user'}</CardTitle>
//                 <CardDescription>{since !== '' && `Friends since: ${since}`}</CardDescription>
//                 {/* <CardDescription>
//                   {firebaseUser?.metadata.creationTime &&
//                     `Joined: ${new Date(firebaseUser?.metadata.creationTime).toString()}`}
//                 </CardDescription> */}
//               </CardHeader>
//               <CardContent className='w-full flex gap-2'>
//                 <Swords strokeWidth={1} />
//                 <MessageSquarePlus strokeWidth={1} />
//                 <UserX strokeWidth={1} />
//               </CardContent>
//             </div>
//           </Card>
//           {/* {isFriend && <FriendChat friendEmail={userEmail} />} */}
//         </div>
//       )}
//     </>
//   );
// }
