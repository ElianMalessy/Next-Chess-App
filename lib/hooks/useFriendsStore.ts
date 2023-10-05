import {create} from 'zustand';

const friendsStore = (set: any, get: any) => ({
  friendsList: [],
  friendRequestsList: [],
  addFriendToStore: (friend: any) => {
    set((userState: any) => ({
      ...userState,
      friendsList: [...get().friendsList, friend],
    }));
  },
  removeFriendAtStore: (friend: any) => {
    const newFriends = get().friendsList;
    newFriends.splice(friend, 1);
    set((userState: any) => ({
      ...userState,
      friendsList: newFriends,
    }));
  },
  addFriendRequestToStore: (friendRequest: any) => {
    set((userState: any) => ({
      ...userState,
      friendRequestsList: [...get().friendRequestsList, friendRequest],
    }));
  },
  removeFriendRequestAtStore: (friendRequest: any) => {
    const newFriendRequests = get().friendRequestsList;
    newFriendRequests.splice(friendRequest, 1);
    set((userState: any) => ({
      ...userState,
      friendRequestsList: newFriendRequests,
    }));
  },
});

export const useFriendsStore = create<any>()(friendsStore);
