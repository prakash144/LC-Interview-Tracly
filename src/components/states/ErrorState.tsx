interface ErrorStateProps {
  message: string;
}

const ErrorState = ({ message }: ErrorStateProps) => (
  <div
    role="alert"
    className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
  >
    {message}
  </div>
);

export default ErrorState;
