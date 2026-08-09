import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';

const STORAGE_KEY = 'devtools-hub:recent';
const MAX_RECENT = 5;

interface RecentToolsState {
  recent: string[];
  addRecent: (slug: string) => void;
  removeRecent: (slug: string) => void;
  clearRecent: () => void;
}

export const useRecentToolsStore = create<RecentToolsState>()(
  persist(
    (set) => ({
      recent: [],
      addRecent: (slug) =>
        set((state) => ({
          recent: [slug, ...state.recent.filter((item) => item !== slug)].slice(0, MAX_RECENT),
        })),
      removeRecent: (slug) =>
        set((state) => ({ recent: state.recent.filter((item) => item !== slug) })),
      clearRecent: () => set({ recent: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
