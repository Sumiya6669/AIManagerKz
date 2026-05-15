import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const variants = {
  default: 'bg-primary text-primary-foreground shadow-ai-glow-sm hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-border bg-white text-foreground hover:bg-secondary',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'text-foreground hover:bg-secondary',
  link: 'text-primary underline-offset-4 hover:underline',
};

const sizes = {
  sm: 'h-9 px-3 text-xs',
  default: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
  icon: 'h-10 w-10',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = (asChild ? Slot : 'button') as React.ElementType;

    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
