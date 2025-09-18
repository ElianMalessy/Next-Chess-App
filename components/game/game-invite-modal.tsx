'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/hooks/useAuthStore';
import { useMessagesStore } from '@/lib/hooks/useMessagesStore';
import { collection, query, where, getDocs, orderBy, limit } from '@firebase/firestore';
import { firestore } from '@/components/firebase';

export default function GameInviteModal({ gameId }: { gameId: string }) {
  const { currentUser } = useAuthStore();
  const { sendMessage, createConversation } = useMessagesStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInviteFriend = async () => {
    if (!friendUsername || !currentUser?.uid || !currentUser?.displayName) return;

    // Prevent self-invitation
    if (friendUsername === currentUser.displayName) {
      alert('You cannot send an invitation to yourself!');
      return;
    }

    setIsLoading(true);
    try {
      // Find user by username in Firestore
      const usersRef = collection(firestore, 'users');
      const userQuery = query(usersRef, where('name', '==', friendUsername));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        alert(`User "${friendUsername}" not found!`);
        setIsLoading(false);
        return;
      }

      // Get the first matching user (usernames should be unique)
      const friendDoc = userSnapshot.docs[0];
      const friendId = friendDoc.id; // This is the user's UID
      const friendData = friendDoc.data();

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
        `You've been invited to play chess! Game ID: ${gameId}`,
        currentUser.uid,
        currentUser.displayName,
        friendId,
        friendData.name || friendUsername,
        'game_invite',
        gameId
      );

      alert('Game invitation sent! Redirecting to game...');
      setIsOpen(false);
      setFriendUsername('');
      
      // Redirect to the game
      router.push(`/game/${gameId}`);

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
            Enter your friend&apos;s username to send them a game invitation, or play alone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="friend-username">Friend&apos;s Username</Label>
            <Input
              id="friend-username"
              type="text"
              placeholder="username"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleInviteFriend}
              disabled={!friendUsername || isLoading}
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
