type LoadingScreenProps = {
  label?: string;
};

export default function LoadingScreen({
  label = "Loading data...",
}: LoadingScreenProps) {
  return (
    <div
      className="surface flex min-h-[420px] items-center justify-center rounded-2xl"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
  );
}
