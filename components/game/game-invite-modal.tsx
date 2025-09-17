'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useAuthStore} from '@/lib/hooks/useAuthStore';
import {useMessagesStore} from '@/lib/hooks/useMessagesStore';
import {collection, query, where, getDocs, orderBy, limit} from '@firebase/firestore';
import {firestore} from '@/components/firebase';

export default function GameInviteModal({gameId}: {gameId: string}) {
  const {currentUser} = useAuthStore();
  const {sendMessage, createConversation} = useMessagesStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInviteFriend = async () => {
    if (!friendEmail || !currentUser?.uid || !currentUser?.displayName) return;
    
    setIsLoading(true);
    try {
      // For now, we'll create a conversation using email as the identifier
      // In a real app, you'd want to have a users collection with email -> uid mapping
      const friendId = `email_${friendEmail}`;
      
      // Create or find conversation
      const conversationsRef = collection(firestore, 'conversations');
      const conversationQuery = query(
        conversationsRef,
        where('participants', 'array-contains', currentUser.uid)
      );
      
      const conversationSnapshot = await getDocs(conversationQuery);
      let conversationId = '';
      
      // Check if conversation already exists
      for (const doc of conversationSnapshot.docs) {
        const participants = doc.data().participants;
        if (participants.includes(friendId)) {
          conversationId = doc.id;
          break;
        }
      }
      
      // Create new conversation if none exists
      if (!conversationId) {
        conversationId = await createConversation(currentUser.uid, friendId);
      }
      
      // Send game invitation message
      await sendMessage(
        conversationId,
        `You've been invited to play chess! Click here to join the game.`,
        currentUser.uid,
        currentUser.displayName,
        friendId,
        friendEmail.split('@')[0], // Use email prefix as display name
        'game_invite',
        gameId
      );
      
      alert('Game invitation sent! The recipient will see it when they log in.');
      setIsOpen(false);
      setFriendEmail('');
      
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayAlone = () => {
    router.push(`/game/${gameId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Play with friends</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a Friend to Play</DialogTitle>
          <DialogDescription>
            Enter your friend&apos;s email to send them a game invitation, or play alone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="friend-email">Friend&apos;s Email</Label>
            <Input
              id="friend-email"
              type="email"
              placeholder="friend@example.com"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleInviteFriend} 
              disabled={!friendEmail || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePlayAlone}
              className="flex-1"
            >
              Play Alone
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
