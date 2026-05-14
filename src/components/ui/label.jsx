import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

export const Label = ({ className, ...props }) => (
  <LabelPrimitive.Root className={cn('text-sm font-medium text-foreground', className)} {...props} />
);
