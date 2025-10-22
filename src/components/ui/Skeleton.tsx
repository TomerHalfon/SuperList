import React from 'react';
import { Skeleton as MuiSkeleton, SkeletonProps as MuiSkeletonProps } from '@mui/material';

export interface SkeletonProps extends Omit<MuiSkeletonProps, 'variant'> {
  /**
   * The variant of the skeleton
   * @default 'text'
   */
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  /**
   * The animation type
   * @default 'wave'
   */
  animation?: 'pulse' | 'wave' | false;
  /**
   * Width of the skeleton
   */
  width?: number | string;
  /**
   * Height of the skeleton
   */
  height?: number | string;
}

/**
 * Skeleton component wrapper for MUI Skeleton
 * Provides consistent skeleton loading states across the application
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  animation = 'wave',
  width,
  height,
  ...props
}) => {
  return (
    <MuiSkeleton
      variant={variant}
      animation={animation}
      width={width}
      height={height}
      {...props}
    />
  );
};
