import React from 'react';
import { Box as MuiBox, BoxProps as MuiBoxProps } from '@mui/material';

export interface BoxProps extends Omit<MuiBoxProps, 'children'> {
  children: React.ReactNode;
}

export const Box: React.FC<BoxProps> = ({ children, ...props }) => {
  return <MuiBox {...props}>{children}</MuiBox>;
};
