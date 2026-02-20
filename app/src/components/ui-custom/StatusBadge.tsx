import { cn } from '@/lib/utils';
import type { ArticleStatus } from '@/types';

interface StatusBadgeProps {
  status: ArticleStatus;
  className?: string;
}

const statusStyles = {
  published: {
    bg: 'bg-status-published-bg',
    text: 'text-status-published-text',
    border: 'border-transparent',
  },
  draft: {
    bg: 'bg-status-draft-bg',
    text: 'text-status-draft-text',
    border: 'border-surface-border',
  },
  archived: {
    bg: 'bg-status-archived-bg',
    text: 'text-status-archived-text',
    border: 'border-transparent',
  },
  in_review: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-500',
    border: 'border-yellow-500/20',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = statusStyles[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      {status === 'in_review' ? 'In Review' : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
