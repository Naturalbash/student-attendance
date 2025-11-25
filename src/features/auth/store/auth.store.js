import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      isLoading: false,

      login: () => set({ isLoading: true }),

      setUser: (user, isAuth) =>
        set({
          user,
          isAuth,
          isLoading: false,
        }),

      logoutUser: () =>
        set({
          user: null,
          isAuth: false,
          isLoading: false,
        }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
