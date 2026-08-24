import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false, // Tracks hydration completion

      setUser: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false }),

      setInitialized: () => set({ isInitialized: true }),
    }),
    {
      name: "user-data",
      // Web specific: Use localStorage instead of AsyncStorage
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setTimeout(() => state.setInitialized(), 0);
        }
      },
    }
  )
);

export default useAuthStore;
