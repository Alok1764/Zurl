import { create } from 'zustand';

const useLinksStore = create((set, get) => ({
  recentLinks: [],
  guestUsed: false,
  lastResult: null,

  setRecentLinks: (links) => set({ recentLinks: links }),

  addLink: (link) => {
    const updated = [link, ...get().recentLinks].slice(0, 3);
    set({ recentLinks: updated, lastResult: link });
  },

  setGuestUsed: (val) => set({ guestUsed: val }),
  clearResult: () => set({ lastResult: null }),
}));

export default useLinksStore;
