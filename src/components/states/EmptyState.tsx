import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => (
  <div
    role="status"
    className="rounded-lg border border-dashed border-border/80 bg-card/70 px-4 py-10 text-center text-sm text-muted-foreground"
  >
    <Inbox className="mx-auto mb-3 size-8 text-muted-foreground/40" />
    <p>{message}</p>
  </div>
);

export default EmptyState;
