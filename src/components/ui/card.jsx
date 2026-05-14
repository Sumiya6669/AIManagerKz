import React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-xl border border-border/60 bg-white text-card-foreground shadow-card', className)} {...props} />
));
Card.displayName = 'Card';

export const CardHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-5', className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn('text-base font-semibold leading-none tracking-tight', className)} {...props} />
);

export const CardDescription = ({ className, ...props }) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn('p-5 pt-0', className)} {...props} />
);
