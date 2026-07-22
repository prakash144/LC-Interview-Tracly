"use client";

import type { ReactNode } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthUnavailable from "@/components/states/AuthUnavailable";
import TopNav from "./TopNav";

interface AppShellProps {
  children: ReactNode;
  footer?: ReactNode;
}

const AppShell = ({ children, footer }: AppShellProps) => {
  const { user, loading, isConfigured, error, login, logout } = useAuthContext();

  if (!isConfigured || error) {
    return <AuthUnavailable error={error ?? undefined} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_0%,rgba(20,184,166,0.12),transparent_28%),radial-gradient(circle_at_85%_8%,rgba(245,158,11,0.10),transparent_24%),linear-gradient(180deg,var(--background),var(--background))]" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-success"
      >
        Skip to content
      </a>
      <TopNav
        user={user}
        authLoading={loading}
        isAuthConfigured={isConfigured}
        onLogin={login}
        onLogout={logout}
      />
      <main id="main-content" className="animate-in fade-in duration-300">{children}</main>
      {footer}
    </div>
  );
};

export default AppShell;
