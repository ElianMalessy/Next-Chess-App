'use client';
import {useEffect, useState} from 'react';
import {EnvelopeClosedIcon} from '@radix-ui/react-icons';
import {Badge} from '@/components/ui/badge';
import {useMessagesStore} from '@/lib/hooks/useMessagesStore';
import {collection, query, where, onSnapshot, orderBy, limit, getDocs} from '@firebase/firestore';
import {firestore} from '@/components/firebase';
import {useAuthStore} from '@/lib/hooks/useAuthStore';

export default function MessageIcon() {
  const {currentUser} = useAuthStore();
  const {unreadCount, setConversations} = useMessagesStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) return;

    // Listen for conversations where current user is a participant
    const conversationsRef = collection(firestore, 'conversations');
    const conversationsQuery = query(
      conversationsRef,
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(conversationsQuery, async (snapshot) => {
      const conversations = [];
      
      for (const doc of snapshot.docs) {
        const conversationData = doc.data();
        
        // Get unread count for this conversation
        const messagesRef = collection(firestore, 'conversations', doc.id, 'messages');
        const unreadQuery = query(
          messagesRef,
          where('receiverId', '==', currentUser.uid),
          where('read', '==', false)
        );
        
        const unreadSnapshot = await getDocs(unreadQuery);
        const unreadCount = unreadSnapshot.size;
        
        // Get last message
        const lastMessageQuery = query(
          messagesRef,
          orderBy('createdAt', 'desc'),
          limit(1)
        );
        const lastMessageSnapshot = await getDocs(lastMessageQuery);
        const lastMessage = lastMessageSnapshot.empty ? null : lastMessageSnapshot.docs[0].data();
        
        conversations.push({
          id: doc.id,
          participants: conversationData.participants,
          unreadCount,
          lastMessage,
        });
      }
      
      setConversations(conversations);
    });

    return () => unsubscribe();
  }, [currentUser?.uid, setConversations]);

  return (
    <div className="relative">
      <EnvelopeClosedIcon className="h-[1.5rem] w-[1.5rem] cursor-pointer" />
      {unreadCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </div>
  );
}
