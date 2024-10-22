import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { account, ID } from "@/app/appwrite";
import {
  AuthenticationFactor,
  AuthenticatorType,
  Models,
  OAuthProvider,
} from "appwrite";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
  isMFAChallengeRequired: boolean;
  mfaStep: "select" | "verify";
  selectedMfaFactor: AuthenticationFactor | null;
  isMfaRecovery: boolean;
  mfaChallengeId: string | null;
  needToChallenge: boolean;
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
  verifySession: () => Promise<void>;
  createMfaRecoveryCodes: () => Promise<string[]>;
  setMfaChallengeRequired: (required: boolean) => void;
  updateMFA: (enabled: boolean) => Promise<void>;
  createMfaChallenge: (
    factor: AuthenticationFactor
  ) => Promise<Models.MfaChallenge | undefined>;
  listMfaFactors: () => Promise<Models.MfaFactors | []>;
  verifyChallenge: (factor: string, token: string) => Promise<void>;
  createTotp: () => Promise<{ secret: string; uri: string } | undefined>;
  verifyAuthenticator: (otp: string) => Promise<void>;
  createSession: (userID: string, secret: string) => Promise<void>;
  updateProfilePicture: (url: string, oldID: string) => Promise<void>;
  updateUserPassword: (
    userId: string,
    secret: string,
    password: string
  ) => Promise<void>;
  removeUser: () => void;
  setMfaStep: (step: "select" | "verify") => void;
  setSelectedMfaFactor: (factor: AuthenticationFactor | null) => void;
  setIsMfaRecovery: (isRecovery: boolean) => void;
  setMfaChallengeId: (id: string | null) => void;
  resetMfaState: () => void;
}

type SessionMiddleware = <T extends AuthState>(
  config: StateCreator<T, [], []>
) => StateCreator<T, [], []>;

const sessionMiddleware: SessionMiddleware = (config) => (set, get, api) => {
  const verifySession = async () => {
    try {
      const session = await account.getSession("current");
      if (session) {
        const user = await account.get();
        set((state) => ({ ...state, user, loading: false }));
      } else {
        set((state) => ({ ...state, user: null, loading: false }));
      }
    } catch (error) {
      set((state) => ({
        ...state,
        user: null,
        error: (error as Error).message,
        loading: false,
      }));
    }
  };

  return config(
    (args) => {
      const result = typeof args === "function" ? args(get()) : args;
      set(result);
      if (result && "user" in result) {
        verifySession();
      }
    },
    get,
    api
  );
};

export const useAuthStore = create<AuthState>()(
  persist(
    sessionMiddleware((set) => ({
      user: null,
      loading: false,
      error: null,
      isMFAChallengeRequired: false,
      mfaStep: "select",
      selectedMfaFactor: null,
      isMfaRecovery: false,
      mfaChallengeId: null,
      needToChallenge: false,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          await account.createEmailPasswordSession(email, password);
          const user = await account.get();
          set({ user, loading: false });
        } catch (error) {
          const typedError = error as { type: string };
          if (typedError.type === `user_more_factors_required`) {
            set({ isMFAChallengeRequired: true, needToChallenge: true });
          }
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

      setMfaChallengeRequired: (required: boolean) => {
        set({ isMFAChallengeRequired: required });
      },

      createMfaRecoveryCodes: async () => {
        set({ loading: true, error: null });
        try {
          const response = await account.createMfaRecoveryCodes();
          set({ loading: false });
          return response.recoveryCodes ?? [];
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
          return [];
        }
      },

      updateMFA: async (enabled: boolean) => {
        set({ loading: true, error: null });
        try {
          await account.updateMFA(enabled);
          const user = await account.get();
          set({ user, loading: false });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      createTotp: async () => {
        set({ loading: true, error: null });
        try {
          const { secret, uri } = await account.createMfaAuthenticator(
            AuthenticatorType.Totp
          );
          set({ loading: false });
          return { secret, uri };
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      verifyAuthenticator: async (otp: string) => {
        set({ loading: true, error: null });
        try {
          await account.updateMfaAuthenticator(AuthenticatorType.Totp, otp);
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      createMfaChallenge: async (factor: AuthenticationFactor) => {
        set({ loading: true, error: null });
        try {
          const challenge = await account.createMfaChallenge(factor);
          set({
            loading: false,
            mfaStep: "verify",
            mfaChallengeId: challenge.$id,
            selectedMfaFactor: factor,
          });
          return challenge;
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      verifyChallenge: async (challengeId: string, token: string) => {
        set({ loading: true, error: null });
        try {
          await account.updateMfaChallenge(challengeId, token);
          const user = await account.get();
          set({
            user,
            loading: false,
            isMFAChallengeRequired: false,
            mfaStep: "select",
            selectedMfaFactor: null,
            isMfaRecovery: false,
            mfaChallengeId: null,
            needToChallenge: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
        }
      },

      listMfaFactors: async () => {
        set({ loading: true, error: null });
        try {
          const response = await account.listMfaFactors();
          set({ loading: false });
          return response;
        } catch (error) {
          set({ error: (error as Error).message, loading: false });
          return [];
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
          await account.createOAuth2Token(
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

      verifySession: async () => {
        set({ loading: true, error: null });
        try {
          const session = await account.getSession("current");
          if (session) {
            const user = await account.get();
            set({ user, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        } catch (error) {
          set({ user: null, error: (error as Error).message, loading: false });
        }
      },

      removeUser: () => {
        set({ user: null });
      },

      setMfaStep: (step) => set({ mfaStep: step }),
      setSelectedMfaFactor: (factor) => set({ selectedMfaFactor: factor }),
      setIsMfaRecovery: (isRecovery) => set({ isMfaRecovery: isRecovery }),
      setMfaChallengeId: (id) => set({ mfaChallengeId: id }),
      resetMfaState: () =>
        set({
          mfaStep: "select",
          selectedMfaFactor: null,
          isMfaRecovery: false,
          mfaChallengeId: null,
        }),
    })),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isMFAChallengeRequired: state.isMFAChallengeRequired,
        mfaChallengeId: state.mfaChallengeId,
        mfaStep: state.mfaStep,
        selectedMfaFactor: state.selectedMfaFactor,
        needToChallenge: state.needToChallenge,
      }),
    }
  )
);
