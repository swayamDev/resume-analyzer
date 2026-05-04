import { create } from "zustand";

declare global {
  interface Window {
    puter: {
      auth: {
        getUser: () => Promise<PuterUser>;
        isSignedIn: () => Promise<boolean>;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
      };
      fs: {
        write: (path: string, data: string | File | Blob) => Promise<File | undefined>;
        read: (path: string) => Promise<Blob>;
        upload: (file: File[] | Blob[]) => Promise<FSItem>;
        delete: (path: string) => Promise<void>;
        readdir: (path: string) => Promise<FSItem[] | undefined>;
      };
      ai: {
        chat: (
          prompt: string | ChatMessage[],
          imageURL?: string | PuterChatOptions,
          testMode?: boolean,
          options?: PuterChatOptions
        ) => Promise<object>;
        img2txt: (image: string | File | Blob, testMode?: boolean) => Promise<string>;
      };
      kv: {
        get: (key: string) => Promise<string | null>;
        set: (key: string, value: string) => Promise<boolean>;
        delete: (key: string) => Promise<boolean>;
        list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
        flush: () => Promise<boolean>;
      };
    };
  }
}

interface PuterStore {
  isLoading: boolean;
  error: string | null;
  puterReady: boolean;
  auth: {
    user: PuterUser | null;
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    checkAuthStatus: () => Promise<boolean>;
  };
  fs: {
    read: (path: string) => Promise<Blob | undefined>;
    upload: (file: File[] | Blob[]) => Promise<FSItem | undefined>;
    delete: (path: string) => Promise<void>;
    readDir: (path: string) => Promise<FSItem[] | undefined>;
  };
  ai: {
    feedback: (path: string, message: string) => Promise<AIResponse | undefined>;
  };
  kv: {
    get: (key: string) => Promise<string | null | undefined>;
    set: (key: string, value: string) => Promise<boolean | undefined>;
    delete: (key: string) => Promise<boolean | undefined>;
    list: (pattern: string, returnValues?: boolean) => Promise<string[] | KVItem[] | undefined>;
    flush: () => Promise<boolean | undefined>;
  };
  init: () => void;
  clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
  typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create<PuterStore>((set, get) => {
  const setError = (msg: string) =>
    set({ error: msg, isLoading: false });

  const checkAuthStatus = async (): Promise<boolean> => {
    const puter = getPuter();
    if (!puter) { setError("Puter.js not available"); return false; }
    set({ isLoading: true, error: null });
    try {
      const isSignedIn = await puter.auth.isSignedIn();
      if (isSignedIn) {
        const user = await puter.auth.getUser();
        set({ auth: { ...get().auth, user, isAuthenticated: true }, isLoading: false });
        return true;
      } else {
        set({ auth: { ...get().auth, user: null, isAuthenticated: false }, isLoading: false });
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check auth status");
      return false;
    }
  };

  const signIn = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) { setError("Puter.js not available"); return; }
    set({ isLoading: true, error: null });
    try {
      await puter.auth.signIn();
      await checkAuthStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    }
  };

  const signOut = async (): Promise<void> => {
    const puter = getPuter();
    if (!puter) { setError("Puter.js not available"); return; }
    set({ isLoading: true, error: null });
    try {
      await puter.auth.signOut();
      set({ auth: { ...get().auth, user: null, isAuthenticated: false }, isLoading: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
    }
  };

  const init = (): void => {
    if (getPuter()) {
      set({ puterReady: true });
      checkAuthStatus();
      return;
    }
    const interval = setInterval(() => {
      if (getPuter()) {
        clearInterval(interval);
        set({ puterReady: true });
        checkAuthStatus();
      }
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      if (!getPuter()) setError("Puter.js failed to load. Please refresh the page.");
    }, 15000);
  };

  return {
    isLoading: true,
    error: null,
    puterReady: false,
    auth: {
      user: null,
      isAuthenticated: false,
      signIn,
      signOut,
      checkAuthStatus,
    },
    fs: {
      read: async (path: string) => {
        const puter = getPuter();
        if (!puter) { setError("Puter.js not available"); return undefined; }
        try { return await puter.fs.read(path); } catch { return undefined; }
      },
      upload: async (files: File[] | Blob[]) => {
        const puter = getPuter();
        if (!puter) { setError("Puter.js not available"); return undefined; }
        return puter.fs.upload(files);
      },
      delete: async (path: string) => {
        const puter = getPuter();
        if (!puter) { setError("Puter.js not available"); return; }
        return puter.fs.delete(path);
      },
      readDir: async (path: string) => {
        const puter = getPuter();
        if (!puter) { setError("Puter.js not available"); return undefined; }
        return puter.fs.readdir(path);
      },
    },
    ai: {
      feedback: async (path: string, message: string) => {
        const puter = getPuter();
        if (!puter) { setError("Puter.js not available"); return undefined; }
        return puter.ai.chat(
          [{ role: "user", content: [{ type: "file", puter_path: path }, { type: "text", text: message }] }],
          { model: "claude-3-7-sonnet" }
        ) as Promise<AIResponse | undefined>;
      },
    },
    kv: {
      get: async (key: string) => {
        const puter = getPuter();
        if (!puter) { setError("Puter.js not available"); return undefined; }
        return puter.kv.get(key);
      },
      set: async (key: string, value: string) => {
        const puter = getPuter();
        if (!puter) { setError("Puter.js not available"); return undefined; }
        return puter.kv.set(key, value);
      },
      delete: async (key: string) => {
        const puter = getPuter();
        if (!puter) { setError("Puter.js not available"); return undefined; }
        return puter.kv.delete(key);
      },
      list: async (pattern: string, returnValues?: boolean) => {
        const puter = getPuter();
        if (!puter) { setError("Puter.js not available"); return undefined; }
        return puter.kv.list(pattern, returnValues ?? false);
      },
      flush: async () => {
        const puter = getPuter();
        if (!puter) { setError("Puter.js not available"); return undefined; }
        return puter.kv.flush();
      },
    },
    init,
    clearError: () => set({ error: null }),
  };
});
