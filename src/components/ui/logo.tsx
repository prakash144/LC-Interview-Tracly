"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  compact?: boolean;
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-7 shrink-0", className)}
      aria-hidden="true"
    >
      <rect
        x="0.5"
        y="0.5"
        width="27"
        height="27"
        rx="6"
        className="stroke-[var(--accent-color,#22c55e)] fill-[var(--accent-color,#22c55e)]/10"
        strokeWidth="1"
      />
      <rect x="8" y="7" width="3" height="14" rx="1.5" className="fill-[var(--accent-color,#22c55e)]" />
      <rect x="14" y="7" width="3" height="9" rx="1.5" className="fill-[var(--accent-color,#22c55e)]" />
      <rect x="14" y="7" width="9" height="3" rx="1.5" className="fill-[var(--accent-color,#22c55e)]" />
      <path
        d="M5 11l-2 3 2 3"
        className="stroke-[var(--accent-color,#22c55e)]"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M23 11l2 3-2 3"
        className="stroke-[var(--accent-color,#22c55e)]"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || (process.env.NODE_ENV === "production" ? "/Interview-Tracly" : "");

function Logo({ className, showTagline = true, compact = false }: LogoProps) {
  const { isDark } = useTheme();

  if (compact) {
    return (
      <Link
        href="/"
        className={cn("group flex items-center", className)}
        aria-label="Interview Tracly - Home"
      >
        <LogoMark className="transition-transform duration-200 group-hover:scale-105" />
      </Link>
    );
  }

  const logoSrc = isDark
    ? `${basePath}/assets/branding/logos/primary-logo-horizontal-dark.png`
    : `${basePath}/assets/branding/logos/primary-logo-horizontal-light.png`;

  return (
    <Link
      href="/"
      className={cn("group flex items-center", className)}
      aria-label="Interview Tracly - Home"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="Interview Tracly"
        className="h-8 w-auto transition-opacity duration-200 group-hover:opacity-80"
      />
      {showTagline && (
        <span className="ml-3 hidden lg:inline text-xs text-muted-foreground">
          Track your journey. Crack your dream company.
        </span>
      )}
    </Link>
  );
}

export { Logo, LogoMark };
export type { LogoProps };
