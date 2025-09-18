'use client';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {collection, query, where, onSnapshot, orderBy, limit, getDocs, doc as firestoreDoc, getDoc} from '@firebase/firestore';
import {firestore} from '@/components/firebase';
import {useAuthStore} from '@/lib/hooks/useAuthStore';
import {useMessagesStore, Message, Conversation} from '@/lib/hooks/useMessagesStore';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import NavbarClient from '@/components/navbar/navbar-client';

export default function MessagesPage() {
  const {currentUser} = useAuthStore();
  const {conversations, setMessages, markAsRead, setConversations} = useMessagesStore();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessagesState] = useState<Message[]>([]);
  const [participantNames, setParticipantNames] = useState<{[key: string]: string}>({});

  // Load conversations on mount
  useEffect(() => {
    if (!currentUser?.uid) return;

    // Listen for conversations where current user is a participant
    const conversationsRef = collection(firestore, 'conversations');
    const conversationsQuery = query(
      conversationsRef,
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(conversationsQuery, async (snapshot) => {
      const conversationsList = [];
      const nameMap: {[key: string]: string} = {};
      
      for (const doc of snapshot.docs) {
        const conversationData = doc.data();
        
        // Get names for all participants
        for (const participantId of conversationData.participants) {
          if (participantId !== currentUser.uid && !nameMap[participantId]) {
            try {
              const userDocRef = firestoreDoc(firestore, 'users', participantId);
              const userDoc = await getDoc(userDocRef);
              if (userDoc.exists()) {
                const userData = userDoc.data() as any;
                nameMap[participantId] = userData.name || participantId;
              } else {
                nameMap[participantId] = participantId;
              }
            } catch (error) {
              console.error('Error fetching user name:', error);
              nameMap[participantId] = participantId;
            }
          }
        }
        
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
        
        conversationsList.push({
          id: doc.id,
          participants: conversationData.participants,
          unreadCount,
          lastMessage,
        });
      }
      
      setParticipantNames(nameMap);
      setConversations(conversationsList);
    });

    return () => unsubscribe();
  }, [currentUser?.uid, setConversations]);

  useEffect(() => {
    if (!selectedConversation || !currentUser?.uid) return;

    const messagesRef = collection(firestore, 'conversations', selectedConversation, 'messages');
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessagesState(messagesData);
      setMessages(messagesData);
      
      // Mark messages as read
      markAsRead(selectedConversation, currentUser.uid);
    });

    return () => unsubscribe();
  }, [selectedConversation, currentUser?.uid, setMessages, markAsRead]);

  const handleGameInvite = (gameId: string) => {
    router.push(`/game/${gameId}`);
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const otherParticipantId = conversation.participants.find(p => p !== currentUser?.uid) || '';
    return participantNames[otherParticipantId] || otherParticipantId;
  };

  return (
    <>
      <NavbarClient />
      <main className="p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Messages</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Conversations List */}
            <div className="space-y-2">
              <h2 className="font-semibold mb-2">Conversations</h2>
              {conversations.map((conversation: Conversation) => (
                <Card 
                  key={conversation.id}
                  className={`cursor-pointer ${selectedConversation === conversation.id ? 'bg-muted' : ''}`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {getOtherParticipant(conversation)}
                        </p>
                        {conversation.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage.text}
                          </p>
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Messages */}
            <div className="md:col-span-2">
              {selectedConversation ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div 
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.senderId === currentUser?.uid 
                            ? 'bg-primary text-primary-foreground ml-8' 
                            : 'bg-muted mr-8'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{message.senderName}</span>
                          <span className="text-xs opacity-70">
                            {message.createdAt?.toDate?.()?.toLocaleTimeString() || 'Now'}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                        {message.type === 'game_invite' && message.gameId && (
                          <Button 
                            size="sm" 
                            className="mt-2"
                            onClick={() => handleGameInvite(message.gameId!)}
                          >
                            Join Game
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    Select a conversation to view messages
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
