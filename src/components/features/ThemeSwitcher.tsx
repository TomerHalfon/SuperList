'use client';

import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Palette } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/hooks/useTheme';
import { ThemeMode } from '@/types/theme';
import { getAllLocalizedThemeInfo, getThemeGradient } from '@/lib/utils/theme-helpers';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const t = useTranslations();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // Get localized theme information
  const localizedThemeInfo = getAllLocalizedThemeInfo(t);

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
              primary={localizedThemeInfo[themeId].name}
              secondary={localizedThemeInfo[themeId].description}
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
