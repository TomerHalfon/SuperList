'use client';

import React, { useState, useTransition } from 'react';
import { IconButton } from '@/components/ui/IconButton';
import { Menu } from '@/components/ui/Menu';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Divider } from '@/components/ui/Divider';
import { signOutAction } from '@/actions/auth';
import { useTranslations } from 'next-intl';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import type { User } from '@/types/auth';

interface UserMenuProps {
  user: User;
}

export const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const t = useTranslations('auth');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPending, startTransition] = useTransition();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleClose();
    startTransition(async () => {
      await signOutAction();
    });
  };

  return (
    <>
      <IconButton
        data-testid="user-menu-button"
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ ml: 2 }}
      >
        <AccountCircleIcon sx={{ width: 32, height: 32 }} />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        id="user-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              minWidth: 200,
              mt: 1.5,
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" color="textSecondary">
            {t('signedInAs')}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
            {user.email}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleSignOut} disabled={isPending}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {isPending ? t('signingOut') : t('signOut')}
        </MenuItem>
      </Menu>
    </>
  );
};

