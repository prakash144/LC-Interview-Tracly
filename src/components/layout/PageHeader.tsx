import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}

const PageHeader = ({ title, description, eyebrow, actions }: PageHeaderProps) => (
  <section className="mx-auto flex max-w-7xl flex-col gap-4 px-4 pb-4 pt-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
    <div className="min-w-0">
      {eyebrow && (
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-success">
          <span className="h-1.5 w-5 rounded-full bg-success/70" />
          {eyebrow}
        </div>
      )}
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-muted-foreground/80">{description}</p>
      )}
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </section>
);

export default PageHeader;
