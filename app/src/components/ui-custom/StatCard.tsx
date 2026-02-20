import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  delta?: string;
  className?: string;
}

export function StatCard({ label, value, delta, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-surface-border rounded-lg p-6',
        className
      )}
    >
      <p className="text-[13px] font-medium text-text-secondary mb-2">{label}</p>
      <p className="text-[28px] font-bold text-text-primary leading-none">{value}</p>
      {delta && (
        <p className="text-xs text-text-muted mt-2">{delta}</p>
      )}
    </div>
  );
}
