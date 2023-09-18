import {collection, doc, updateDoc, getDocs, query, where, arrayRemove, getDoc} from '@firebase/firestore';
import {firestore} from '@/components/firebase';
import {z} from 'zod';

export async function GET(request: Request, {params}: {params: {slug: string}}) {
  const emailSchema = z.string().email();
  const email = params.slug;
  try {
    emailSchema.parse(email);
    const userFriends = await getDocs(collection(firestore, 'users', email, 'friends'));
    const friendsIDFiller: any = [];
    const friendsData: any = [];
    userFriends.forEach((friend) => {
      friendsIDFiller.push(friend.id);
    });
    for (let i = 0; i < friendsIDFiller.length; i++) {
      const snapshot = await getDoc(doc(firestore, 'users', friendsIDFiller[i]));
      friendsData.push(snapshot.data());
    }
    return new Response(JSON.stringify(friendsData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error);
    return new Response('Invalid Email', {status: 400});
  }
}
