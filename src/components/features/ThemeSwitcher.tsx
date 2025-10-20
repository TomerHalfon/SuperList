'use client';

import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Palette } from '@mui/icons-material';
import { useTheme } from '@/hooks/useTheme';
import { ThemeMode } from '@/types/theme';

// Theme color gradients for the circular preview
const getThemeGradient = (theme: ThemeMode): string => {
  const gradients: Record<ThemeMode, string> = {
    'light': 'linear-gradient(135deg, #1976d2 0%, #dc004e 100%)',
    'dark': 'linear-gradient(135deg, #90caf9 0%, #f48fb1 100%)',
    'purple-night': 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
    'ocean-blue': 'linear-gradient(135deg, #0277bd 0%, #00acc1 100%)',
    'sunset-orange': 'linear-gradient(135deg, #ff6f00 0%, #ff5722 100%)',
    'forest-green': 'linear-gradient(135deg, #2e7d32 0%, #558b2f 100%)',
    'high-contrast': 'linear-gradient(135deg, #000000 0%, #ffffff 100%)',
    'cyberpunk': 'linear-gradient(135deg, #ff0080 0%, #00ffff 100%)',
    'retro': 'linear-gradient(135deg, #ff6b9d 0%, #4fc3f7 100%)',
  };
  return gradients[theme];
};

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, availableThemes, themeInfo } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeSelect = (selectedTheme: ThemeMode) => {
    setTheme(selectedTheme);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          width: 40,
          height: 40,
          background: getThemeGradient(theme),
          border: '2px solid',
          borderColor: 'divider',
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s ease',
          },
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
        }}
        aria-label="Select theme"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Palette sx={{ color: 'white', fontSize: 18 }} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 200,
            maxHeight: 400,
            '& .MuiMenuItem-root': {
              py: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {availableThemes.map((themeId) => (
          <MenuItem
            key={themeId}
            onClick={() => handleThemeSelect(themeId)}
            selected={theme === themeId}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: getThemeGradient(themeId),
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={themeInfo[themeId].name}
              secondary={themeInfo[themeId].description}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: theme === themeId ? 600 : 400,
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
