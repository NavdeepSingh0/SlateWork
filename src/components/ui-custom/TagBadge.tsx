import { cn } from '@/lib/utils';

interface TagBadgeProps {
  name: string;
  className?: string;
}

export function TagBadge({ name, className }: TagBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-surface-border text-text-secondary',
        className
      )}
    >
      {name}
    </span>
  );
}
