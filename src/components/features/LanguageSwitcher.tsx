'use client';

import React, { useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { IconButton } from '@/components/ui/IconButton';
import { Menu } from '@/components/ui/Menu';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Divider } from '@/components/ui/Divider';
import LanguageIcon from '@mui/icons-material/Language';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckIcon from '@mui/icons-material/Check';

interface LanguageSwitcherProps {
  size?: 'small' | 'medium' | 'large';
}

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  size = 'medium' 
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLocale: string) => {
    handleClose();
    
    if (newLocale === locale) return;

    startTransition(() => {
      // Set the locale cookie
      document.cookie = `locale=${newLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
      
      // Force a full page reload to apply the new locale
      window.location.reload();
    });
  };

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <>
      <IconButton
        onClick={handleClick}
        size={size}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        title="Change language"
        sx={{ 
          ml: 1,
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <LanguageIcon />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        id="language-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: 160,
              mt: 1.5,
            },
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem 
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            disabled={isPending}
            sx={{
              py: 1,
              px: 2,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {locale === language.code && (
                <CheckIcon fontSize="small" color="primary" />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={language.nativeName}
              secondary={language.name}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: locale === language.code ? 600 : 400,
              }}
              secondaryTypographyProps={{
                fontSize: '0.75rem',
                color: 'text.secondary',
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
