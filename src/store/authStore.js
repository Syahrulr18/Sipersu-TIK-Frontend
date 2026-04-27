import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth Store — Zustand with localStorage persistence.
 * 
 * State:
 *   user     — current user object or null
 *   token    — JWT token string or null
 *   isAuthenticated — derived boolean
 * 
 * Actions:
 *   login(user, token)  — set credentials
 *   logout()            — clear everything
 *   updateUser(data)    — partial-update user
 */
const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: 'pnup_surat_auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
