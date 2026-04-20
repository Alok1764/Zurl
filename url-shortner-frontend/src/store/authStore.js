import { create } from 'zustand';
import { getUser, logout as apiLogout } from '../api/auth.js';

const useAuthStore = create((set, get) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,

  init: async () => {
    try {
      const user = await getUser();
      set({ user, isLoggedIn: !!user, isLoading: false });
    } catch {
      set({ user: null, isLoggedIn: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isLoggedIn: !!user }),

  logout: async () => {
    await apiLogout();
    set({ user: null, isLoggedIn: false });
  },

  decrementUsage: () => {
    const { user } = get();
    if (user) set({ user: { ...user, linksUsedToday: user.linksUsedToday + 1 } });
  },

  shotsLeft: () => {
    const { user } = get();
    if (!user) return 0;
    return Math.max(0, user.dailyLimit - user.linksUsedToday);
  },
}));

export default useAuthStore;
