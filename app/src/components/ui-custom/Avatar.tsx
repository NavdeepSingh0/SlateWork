import { cn } from '@/lib/utils';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
};

export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full bg-surface-border flex items-center justify-center',
        sizeStyles[size],
        className
      )}
    >
      <span className="text-text-primary font-medium">{initials}</span>
    </div>
  );
}
