interface WarningBannerProps {
  message: string;
  variant?: 'info' | 'warning' | 'critical';
}

const styles = {
  info: 'bg-glacial/10 border-glacial text-glacial-dark',
  warning: 'bg-adventure/10 border-adventure text-rock',
  critical: 'bg-red-50 border-red-500 text-red-700',
};

export default function WarningBanner({ message, variant = 'warning' }: WarningBannerProps) {
  return (
    <div
      role="note"
      className={`flex items-start gap-3 rounded-xl border-l-4 px-4 py-3 text-sm ${styles[variant]}`}
    >
      <span aria-hidden="true" className="mt-0.5 text-lg">
        ⚠️
      </span>
      <p>{message}</p>
    </div>
  );
}
