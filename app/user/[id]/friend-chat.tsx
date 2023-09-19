import {collection, addDoc, where, serverTimestamp, onSnapshot, query, orderBy} from '@firebase/firestore';
import {useState, useEffect} from 'react';
import {firestore} from '@/components/firebase';
import {useAuth} from '@/components/contexts/auth-provider';
import {Card, CardHeader, CardContent, CardTitle, CardDescription} from '@/components/ui/card';

export const Chat = ({friendEmail}: {friendEmail: string}) => {
  const {currentUser} = useAuth();
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesRef = collection(firestore, 'users', currentUser?.email || '', 'friends');

  const room = `${currentUser?.email}_${friendEmail}`;
  useEffect(() => {
    const queryMessages = query(messagesRef, where('room', '==', room), orderBy('createdAt'));
    const unSubscribe = onSnapshot(queryMessages, (snapshot) => {
      const messages: any = [];
      snapshot.forEach((doc) => {
        messages.push({...doc.data(), id: doc.id});
      });
      setMessages(messages);
    });

    return () => unSubscribe();
  }, [messagesRef, room]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (newMessage === '') return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: currentUser?.displayName,
      room,
    });

    setNewMessage('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
        <CardDescription>{`${currentUser?.displayName} - `}</CardDescription>
      </CardHeader>
      <div className='messages'>
        {messages.map((message: any) => (
          <div key={message.id} className='message'>
            <span className='user'>{message.user}:</span> {message.text}
          </div>
        ))}
      </div>
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
    </Card>
  );
};
