"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { logout as firebaseLogout, signInWithGoogle, subscribeToAuth } from "@/services/firebase/authService";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      if (process.env.NODE_ENV === "development") {
        console.info("[Auth] Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* env variables to enable authentication.");
      }
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = subscribeToAuth((nextUser) => {
        setUser(nextUser);
        setLoading(false);
      });
      return unsubscribe;
    } catch (authError) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Auth] Failed to initialize:", authError);
      }
      setError("Unable to initialize authentication. Please check your configuration and try again.");
      setLoading(false);
    }
  }, []);

  const login = useCallback(async () => {
    setError(null);
    if (!isFirebaseConfigured) {
      setError("Authentication is not available on this instance.");
      return;
    }
    try {
      await signInWithGoogle();
    } catch (authError) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Auth] Sign-in failed:", authError);
      }
      if (authError instanceof Error && authError.message?.includes("popup")) {
        setError("Sign-in popup was blocked or closed. Please allow popups and try again.");
      } else {
        setError("Unable to complete sign-in. Please try again.");
      }
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    if (!isFirebaseConfigured) return;
    try {
      await firebaseLogout();
    } catch (authError) {
      if (process.env.NODE_ENV === "development") {
        console.error("[Auth] Sign-out failed:", authError);
      }
      setError("Unable to sign out. Please try again.");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, isConfigured: isFirebaseConfigured, login, logout }),
    [user, loading, error, login, logout]
  );

  if (!loading && !isFirebaseConfigured && !user) {
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" suppressHydrationWarning>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Initializing...
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
