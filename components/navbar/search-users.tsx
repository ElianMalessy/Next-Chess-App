import {kv} from '@vercel/kv';
import SearchBar from './search-bar';
export default async function SearchUsers() {
  const users = await kv.lrange('users', 0, -1);

  return <SearchBar users={users} />;
}
