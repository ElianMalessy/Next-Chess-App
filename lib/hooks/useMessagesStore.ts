import {create} from 'zustand';
import {collection, query, where, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDocs} from '@firebase/firestore';
import {firestore} from '@/components/firebase';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  createdAt: any;
  read: boolean;
  type: 'message' | 'game_invite';
  gameId?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

const messagesStore = (set: any, get: any) => ({
  conversations: [] as Conversation[],
  messages: [] as Message[],
  unreadCount: 0,
  
  setConversations: (conversations: Conversation[]) => {
    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    set({conversations, unreadCount: totalUnread});
  },
  
  setMessages: (messages: Message[]) => {
    set({messages});
  },
  
  markAsRead: async (conversationId: string, userId: string) => {
    const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
    const unreadQuery = query(messagesRef, where('read', '==', false), where('receiverId', '==', userId));
    const snapshot = await getDocs(unreadQuery);
    
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, {read: true})
    );
    
    await Promise.all(updatePromises);
  },
  
  sendMessage: async (conversationId: string, text: string, senderId: string, senderName: string, receiverId: string, receiverName: string, type: 'message' | 'game_invite' = 'message', gameId?: string) => {
    const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
    await addDoc(messagesRef, {
      text,
      senderId,
      senderName,
      receiverId,
      receiverName,
      createdAt: serverTimestamp(),
      read: false,
      type,
      gameId: gameId || null,
    });
  },
  
  createConversation: async (participant1: string, participant2: string) => {
    const conversationsRef = collection(firestore, 'conversations');
    const docRef = await addDoc(conversationsRef, {
      participants: [participant1, participant2].sort(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },
});

export const useMessagesStore = create<any>()(messagesStore);
