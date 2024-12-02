import { create } from 'zustand';
import { User } from '../types';
import { signIn, signOut as authSignOut, getCurrentUser, getSession } from '../services/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => Promise<void>;
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (user) => {
    set({ user, isAuthenticated: true });
  },
  updateUser: (user) => set({ user }),
  logout: async () => {
    await authSignOut();
    set({ user: null, isAuthenticated: false });
  },
  initAuth: async () => {
    try {
      const session = await getSession();
      if (session) {
        const userData = await getCurrentUser();
        if (userData) {
          set({ user: userData, isAuthenticated: true });
          return;
        }
      }
        set({ user: null, isAuthenticated: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    }
  },
}));