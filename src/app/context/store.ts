// app/context/use-session-store.ts

import { create } from 'zustand';
import { Users } from '@/types/users';

interface SessionState {
  user: Users | null; // user 객체로 변경
  setUser: (user: Users | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));