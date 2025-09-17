import {create} from 'zustand';
const profilePicStore = (set: any) => ({
  img: '/default-profile-pic.svg',
  scale: 1,
  startOffset: {x: 0, y: 0},
  // change kv store to not have friends data all in /friends
  setScale: (val: number) => {
    set((state: any) => ({
      ...state,
      scale: val,
    }));
  },
  setStartOffset: (val: any) => {
    set((state: any) => ({
      ...state,
      startOffset: {x: val.x, y: val.y},
    }));
  },
  setImg: (val: any) => {
    set((state: any) => ({
      ...state,
      img: val,
    }));
  },
});

export const useProfilePicStore = create<any>()(
  profilePicStore
);
