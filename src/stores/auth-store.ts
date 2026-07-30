import { create } from "zustand";
import { api } from "@/lib/api";

interface AuthState {
  token: string | null;
  admin: { id: string; email: string; name: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthed: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  admin: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post<{ token: string; admin: { id: string; email: string; name: string } }>("/auth/login", { email, password });
      api.setToken(res.token);
      set({ token: res.token, admin: res.admin, loading: false });
      return true;
    } catch {
      set({ loading: false });
      return false;
    }
  },

  logout: () => {
    api.setToken(null);
    set({ token: null, admin: null });
  },

  isAuthed: () => !!get().token,
}));
