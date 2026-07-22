interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => (
  <div
    role="status"
    aria-live="polite"
    className="rounded-lg border border-border/70 bg-card/80 px-4 py-7 text-center text-sm text-muted-foreground shadow-sm"
  >
    <div className="mx-auto mb-3 h-2 max-w-xs overflow-hidden rounded-full bg-secondary/80">
      <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-success via-info to-warning" />
    </div>
    {message}
  </div>
);

export default LoadingState;
