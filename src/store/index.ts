import { create } from 'zustand';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AppStore = {
  isAuthenticated: boolean;
  authStatus: AuthStatus;
  setAuthenticated: (value: boolean) => void;
  setAuthStatus: (status: AuthStatus) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  isAuthenticated: false,
  authStatus: 'loading',
  setAuthenticated: (value) =>
    set({
      isAuthenticated: value,
      authStatus: value ? 'authenticated' : 'unauthenticated',
    }),
  setAuthStatus: (status) => set({ authStatus: status }),
}));
