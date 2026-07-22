import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type IconType = ComponentType<{ className?: string }>;

export const PremiumSurface = ({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) => (
  <section
    className={cn(
      "rounded-lg border border-border/70 bg-card/90 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(15,23,42,0.05)] backdrop-blur",
      interactive && "transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-card hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]",
      className
    )}
  >
    {children}
  </section>
);

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  action,
  icon: Icon,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: IconType;
  className?: string;
}) => (
  <div className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        {Icon && (
          <span className="flex size-7 items-center justify-center rounded-md border border-border/70 bg-secondary/70 text-success">
            <Icon className="size-3.5" />
          </span>
        )}
        <div>
          {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{eyebrow}</p>}
          <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
      </div>
      {description && <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">{description}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const MetricCard = ({
  label,
  value,
  detail,
  icon: Icon,
  tone = "success",
  className,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  icon: IconType;
  tone?: "success" | "info" | "warning" | "rose";
  className?: string;
}) => {
  const toneClass = {
    success: "border-success/20 bg-success/10 text-success",
    info: "border-info/20 bg-info/10 text-info",
    warning: "border-warning/25 bg-warning/10 text-warning",
    rose: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  }[tone];

  return (
    <PremiumSurface interactive className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground tabular-nums">{value}</div>
          {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
        </div>
        <span className={cn("flex size-10 items-center justify-center rounded-md border", toneClass)}>
          <Icon className="size-4" />
        </span>
      </div>
    </PremiumSurface>
  );
};

export const CommandLink = ({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) => (
  <Link
    href={href}
    className={cn("inline-flex items-center gap-1 rounded-md text-xs font-medium text-success transition-colors hover:text-success/80 focus-visible:ring-2 focus-visible:ring-success/40", className)}
  >
    {children}
    <ArrowRight className="size-3" />
  </Link>
);
