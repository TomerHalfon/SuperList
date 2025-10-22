import React from 'react';
import { Stack as MuiStack, StackProps as MuiStackProps } from '@mui/material';

export interface StackProps extends MuiStackProps {
  children?: React.ReactNode;
}

/**
 * Custom Stack component that wraps MUI Stack for layout
 */
export const Stack: React.FC<StackProps> = ({ children, ...props }) => {
  return <MuiStack {...props}>{children}</MuiStack>;
};

