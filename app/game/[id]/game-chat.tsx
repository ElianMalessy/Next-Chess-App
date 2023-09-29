'use client';
import {onValue, ref, push, set, child} from '@firebase/database';

import {useState, useEffect, useRef, useCallback} from 'react';
import {Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter} from '@/components/ui/card';
import useGameStore, {useEndStateStore} from '@/hooks/useStateStore';
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
  const {playerColor, turn} = useGameStore();
  const dbRef = ref(realtimeDB, gameID + '/chat');
  const [message, setMessage] = useState<string[][]>([]);
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
      const sentMessage: any = [currentUserName ? currentUserName : 'anonymous', typingMessage, currTime];
      const newList = message.concat([sentMessage]);
      setMessage(newList);
      setTypingMessage('');

      const key = push(dbRef).key;
      if (key) set(child(dbRef, key), sentMessage);
    },
    [dbRef, currentUserName, message, typingMessage, getTime]
  );

  return (
    <Card className='w-full h-full relative'>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription>Turn: {turn}</CardDescription>
        <CardDescription>Player color: {playerColor}</CardDescription>

        {/* <CardDescription>{`${currentUserName} - ${opponentUsername.replaceAll('_', ' ')}`}</CardDescription> */}
      </CardHeader>
      <CardContent className='w-full relative'>
        <ScrollArea className='w-full 2xs:h-[8rem] lg:h-[23rem] absolute pr-3'>
          {message &&
            message.map((message, index) => {
              return (
                <li key={index} className='flex items-center'>
                  <div className='text-xs text-muted-foreground'>
                    {`${message[0]}: `}
                    <span className='break-all text-sm text-primary'>{` ${message[1]}`}</span>
                  </div>

                  <span className='ml-auto text-xs text-muted-foreground'>{message[2] ? message[2] : getTime()}</span>
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
            className=''
          />
          <button type='submit' className='send-button'>
            Send
          </button>
        </form>
      </CardFooter>
    </Card>
  );
}
