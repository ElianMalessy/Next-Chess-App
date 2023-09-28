'use client';
import {
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
  updateDoc,
  addDoc,
  collection,
} from '@firebase/firestore';
import {useState, useEffect, useRef} from 'react';
import {firestore} from '@/components/firebase';
import {Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter} from '@/components/ui/card';

export default function FriendChat({
  friendEmail,
  friendUsername,
  currentUserEmail,
  currentUserName,
}: {
  friendEmail: string;
  friendUsername: string;
  currentUserEmail: string;
  currentUserName: string;
}) {
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');
  let room = '';
  let roomRef: any = null;
  if (currentUserEmail) {
    const compare = currentUserEmail.localeCompare(friendEmail, 'en', {sensitivity: 'base'});
    room = compare > 0 ? `${friendEmail}_${currentUserEmail}` : `${currentUserEmail}_${friendEmail}`;
    roomRef = collection(firestore, room, 'chats', 'rooms');
  }

  const firstRender = useRef(true);
  useEffect(() => {
    if (!room || !roomRef || !firstRender.current) return;
    firstRender.current = false;
    const queryMessages = query(roomRef, where('room', '==', room), orderBy('createdAt'));
    const unSubscribe = onSnapshot(queryMessages, (snapshot) => {
      const messages: any = [];
      snapshot.forEach((message: any) => {
        console.log(message.data());
        messages.push({...message.data()});
      });
      setMessages(messages);
    });

    return () => unSubscribe();
  }, [roomRef, room]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    await addDoc(roomRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: currentUserName,
      room,
    });
    setNewMessage('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription>{`${currentUserName} - ${friendUsername.replaceAll('_', ' ')}`}</CardDescription>
      </CardHeader>
      <CardContent>
        {messages.map((message: any, index: number) => (
          <div key={index}>
            <span>{message.user}:</span> {message.text}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className='new-message-form'>
          <input
            type='text'
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            className='new-message-input'
            placeholder='Type your message here...'
          />
          <button type='submit' className='send-button'>
            Send
          </button>
        </form>
      </CardFooter>
    </Card>
  );
}
