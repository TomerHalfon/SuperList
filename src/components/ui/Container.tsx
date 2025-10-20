import React from 'react';
import { Container as MuiContainer, ContainerProps as MuiContainerProps } from '@mui/material';

export interface ContainerProps extends Omit<MuiContainerProps, 'children'> {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableGutters?: boolean;
  fixed?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth = 'lg',
  disableGutters = false,
  fixed = false,
  ...props 
}) => {
  return (
    <MuiContainer 
      maxWidth={maxWidth}
      disableGutters={disableGutters}
      fixed={fixed}
      {...props}
    >
      {children}
    </MuiContainer>
  );
};
