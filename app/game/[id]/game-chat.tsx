'use client';
import {onValue, ref, push, set, child} from '@firebase/database';

import {useState, useEffect, useRef, useCallback} from 'react';
import {Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter} from '@/components/ui/card';
import {useEndStateStore} from '@/hooks/useStateStore';
import {realtimeDB} from '@/components/firebase';
import {ScrollArea} from '@/components/ui/scroll-area';

export default function GameChat({
  // opponentEmail,
  // opponentUsername,
  // currentUserEmail,
  currentUserName,
  gameID,
}: {
  // opponentEmail: string;
  // opponentUsername: string;
  // currentUserEmail: string;
  currentUserName: string;
  gameID: string;
}) {
  const {checkmate} = useEndStateStore();
  const dbRef = ref(realtimeDB, gameID + '/chat');
  const [message, setMessage] = useState([]);
  const [typingMessage, setTypingMessage] = useState('');

  useEffect(() => {
    if (!dbRef) return;
    const dbMessages: any = [];
    const listener = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          Object.values(snapshot.val()).forEach((msg) => {
            dbMessages.push(msg);
          });
          setMessage(dbMessages);
        }
      },
      {
        onlyOnce: true,
      }
    );
    return () => {
      listener;
    };
  }, []);

  const getTime = useCallback(() => {
    const today = new Date();
    return today.getHours() + ':' + (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes());
  }, []);

  const handleChange = useCallback((e: any) => {
    setTypingMessage(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      if (typingMessage === '') return;

      const currTime = getTime();
      const sentMessage: any = [currentUserName, typingMessage, currTime];
      const newList = message.concat([sentMessage]);
      setMessage(newList);
      setTypingMessage('');

      const key = push(dbRef).key;
      if (key) set(child(dbRef, key), sentMessage);
    },
    [dbRef, currentUserName, message, typingMessage, getTime]
  );

  return (
    <Card className='2xs:max-w-[min(560px,95vw)] lg:max-w-[20rem]'>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        {/* <CardDescription>{`${currentUserName} - ${opponentUsername.replaceAll('_', ' ')}`}</CardDescription> */}
      </CardHeader>
      <CardContent className='w-full'>
        <ScrollArea className='w-full'>
          {message &&
            message.map((message, index) => {
              return (
                <li key={index} className='flex items-center w-full '>
                  <span className='w-full break-all'>{`${message[0]}: ${message[1]}`}</span>
                  <span style={{color: 'rgba(56, 56, 56, 0.825)', fontSize: '0.9rem', marginLeft: 'auto'}}>
                    {message[2] ? message[2] : getTime()}
                  </span>
                </li>
              );
            })}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className='new-message-form'>
          <input
            placeholder='type to chat...'
            type='text'
            onChange={handleChange}
            value={typingMessage}
            aria-label='Chat input'
            className='w-full'
          />
          <button type='submit' className='send-button'>
            Send
          </button>
        </form>
      </CardFooter>
    </Card>
  );
}
