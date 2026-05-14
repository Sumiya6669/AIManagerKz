import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground',
    secondary: 'border-transparent bg-secondary text-secondary-foreground',
    outline: 'border-border text-foreground',
    success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-100 bg-amber-50 text-amber-700',
    danger: 'border-red-100 bg-red-50 text-red-700',
  };
  return (
    <span
      className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold', variants[variant], className)}
      {...props}
    />
  );
}
