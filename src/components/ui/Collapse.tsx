import React from 'react';
import { 
  Collapse as MuiCollapse, 
  CollapseProps as MuiCollapseProps 
} from '@mui/material';

export interface CollapseProps extends Omit<MuiCollapseProps, 'children'> {
  children: React.ReactNode;
}

export const Collapse: React.FC<CollapseProps> = ({ children, ...props }) => {
  return (
    <MuiCollapse {...props}>
      {children}
    </MuiCollapse>
  );
};
