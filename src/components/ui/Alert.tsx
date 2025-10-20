'use client';

import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps } from '@mui/material';

export interface AlertProps extends Omit<MuiAlertProps, 'severity'> {
  severity?: 'success' | 'error' | 'warning' | 'info';
  variant?: 'filled' | 'outlined' | 'standard';
}

export const Alert: React.FC<AlertProps> = ({ 
  severity = 'info', 
  variant = 'filled',
  ...props 
}) => {
  return (
    <MuiAlert 
      severity={severity} 
      variant={variant}
      {...props} 
    />
  );
};
