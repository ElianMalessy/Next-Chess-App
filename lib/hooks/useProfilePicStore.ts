import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
const profilePicStore = (set: any) => ({
  img: 'https://firebasestorage.googleapis.com/v0/b/wechess-2ecf9.appspot.com/o/default-profile-pic.svg?alt=media&token=cbd585f6-a638-4e25-a502-436d2109ed7a',
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
  persist(profilePicStore, {
    name: 'profile-pic-data',
    skipHydration: true,
  })
);
