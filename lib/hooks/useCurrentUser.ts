'use client';
import {useAuthStore} from './useAuthStore';

export function useCurrentUser() {
  const {currentUser} = useAuthStore();
  return currentUser;
}
