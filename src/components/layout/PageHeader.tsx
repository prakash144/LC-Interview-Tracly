import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: ReactNode;
  actions?: ReactNode;
}

const PageHeader = ({ title, description, eyebrow, actions }: PageHeaderProps) => (
  <section className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
    <div className="min-w-0">
      {eyebrow && (
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-success">
          {eyebrow}
        </div>
      )}
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
      {description && (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      )}
    </div>
    {actions && <div className="shrink-0">{actions}</div>}
  </section>
);

export default PageHeader;
