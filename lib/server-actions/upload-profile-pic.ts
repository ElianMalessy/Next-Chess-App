"use server";
import { kv } from "@vercel/kv";

export async function uploadProfilePicKV(
  currentUserId: string,
  startOffset: { x: number; y: number },
  scale: number,
  img: string
) {
  await kv.hset(currentUserId, {
    photoURL: img,
    startOffset: startOffset,
    scale: scale,
  });
  // const friends: any = await kv.lrange(`${currentUserId}/friends`, 0, -1);
  // for(let i = 0; i <friends.length; i++) {
  //   const friendFriends: any = await kv.lrange(`${friends[i].uid}/friends`, 0, -1);
  //   for(let j = 0; j<friendFriends.length; i++) {
  //     if(friendFriends[j].uid === currentUserId) {
  //       kv.lset(`${friends[i].uid}/friends`, j, {photoURL: })
  //     }
  //   }
  // }
}
