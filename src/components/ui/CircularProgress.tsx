import React from 'react';
import {
  CircularProgress as MuiCircularProgress,
  CircularProgressProps as MuiCircularProgressProps,
} from '@mui/material';

export interface CircularProgressProps extends MuiCircularProgressProps {
  size?: number | string;
}

/**
 * Custom CircularProgress component that wraps MUI CircularProgress
 */
export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 40,
  ...props
}) => {
  return <MuiCircularProgress size={size} {...props} />;
};

