import { create } from "zustand";
import { persist } from "zustand/middleware";
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
    onSuccess?: string,
    onFailure?: string,
    scopes?: string[]
  ) => Promise<void>;
  getSession: () => Promise<Models.Session | undefined>;
  createSession: (userID: string, secret: string) => Promise<void>;
  updateProfilePicture: (url: string, oldID: string) => Promise<void>;
  updateUserPassword: (
    userId: string,
    secret: string,
    password: string
  ) => Promise<void>;
  removeUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
          await account.createVerification(email);
          await useAuthStore.getState().login(email, password);
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      loginWithOAuth: async (
        provider: OAuthProvider,
        onSuccess?: string,
        onFailure?: string,
        scopes?: string[]
      ) => {
        set({ loading: true, error: null });
        try {
          await account.createOAuth2Session(
            provider,
            onSuccess,
            onFailure,
            scopes
          );
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

      updateUserPassword: async (
        userId: string,
        secret: string,
        password: string
      ) => {
        set({ loading: true, error: null });
        try {
          await account.updateRecovery(userId, secret, password);
          set({ loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      updateProfilePicture: async (url: string, oldID: string) => {
        set({ loading: true, error: null });
        try {
          await account.updatePrefs({
            profilePictureUrl: url,
            profilePictureId: oldID,
          });
          const user = await account.get();
          set({ user });
          set({ loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      createSession: async (userID: string, secret: string) => {
        set({ loading: true, error: null });
        try {
          await account.createSession(userID, secret);
          const user = await account.get();
          set({ user });
          set({ loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      getSession: async () => {
        set({ loading: true, error: null });
        try {
          const session = await account.getSession("current");
          set({ loading: false });
          return session;
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      removeUser: () => {
        set({ user: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
