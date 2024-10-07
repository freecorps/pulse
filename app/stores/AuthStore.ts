import { create } from "zustand";
import { account, ID } from "@/app/appwrite";
import { Models, OAuthProvider } from "appwrite";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithOAuth: (
    provider: OAuthProvider,
    onSucces?: string,
    onFailure?: string,
    scopes?: string[]
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ loading: true, error: null });
    try {
      await account.create(ID.unique(), email, password, name);
      await useAuthStore.getState().login(email, password);
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  loginWithOAuth: async (
    provider: OAuthProvider,
    onSucces?: string,
    onFailure?: string,
    scopes?: string[]
  ) => {
    set({ loading: true, error: null });
    try {
      await account.createOAuth2Session(provider, onSucces, onFailure, scopes);
      const user = await account.get();
      set({ user, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await account.deleteSession("current");
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  resetPassword: async (email: string) => {
    set({ loading: true, error: null });
    try {
      await account.createRecovery(
        email,
        "https://pulse.freecorps.xyz/reset-password"
      );
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));
