import React from 'react';
import { LinearProgress as MuiLinearProgress, LinearProgressProps as MuiLinearProgressProps, Box } from '@mui/material';

export interface ProgressProps extends Omit<MuiLinearProgressProps, 'variant'> {
  variant?: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  value?: number;
  showLabel?: boolean;
  size?: 'small' | 'medium';
}

export const Progress: React.FC<ProgressProps> = ({ 
  variant = 'determinate',
  value = 0,
  showLabel = false,
  size = 'medium',
  sx,
  ...props 
}) => {
  const height = size === 'small' ? 4 : 8;
  
  return (
    <Box sx={{ width: '100%', ...sx }}>
      <MuiLinearProgress
        variant={variant}
        value={value}
        sx={{
          height,
          borderRadius: height / 2,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: height / 2,
          },
        }}
        {...props}
      />
      {showLabel && variant === 'determinate' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 0.5,
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.6)' }}>
            {Math.round(value)}%
          </span>
        </Box>
      )}
    </Box>
  );
};
