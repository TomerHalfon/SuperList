import React from 'react';
import { Grid as MuiGrid, GridProps as MuiGridProps } from '@mui/material';

export interface GridProps extends MuiGridProps {
  container?: boolean;
  size?: number | 'auto' | 'grow' | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  xs?: number | boolean | 'auto';
  sm?: number | boolean | 'auto';
  md?: number | boolean | 'auto';
  lg?: number | boolean | 'auto';
  xl?: number | boolean | 'auto';
}

export const Grid: React.FC<GridProps> = ({ 
  container = false,
  size,
  xs,
  sm,
  md,
  lg,
  xl,
  sx,
  ...props 
}) => {
  // Convert legacy props to new size prop format
  const sizeProp = size || (xs || sm || md || lg || xl ? { 
    xs: xs === true ? 'auto' : xs, 
    sm: sm === true ? 'auto' : sm, 
    md: md === true ? 'auto' : md, 
    lg: lg === true ? 'auto' : lg, 
    xl: xl === true ? 'auto' : xl 
  } : undefined);
  
  return (
    <MuiGrid
      container={container}
      size={sizeProp}
      sx={{
        ...sx,
      }}
      {...props}
    />
  );
};
