
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

export const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn("animate-pulse", className)}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

SkeletonCard.displayName = "SkeletonCard";

export default SkeletonCard;
