import React from 'react';
import {
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  MenuProps as MuiMenuProps,
  MenuItemProps as MuiMenuItemProps,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

// Re-export MUI Menu components with consistent naming
export interface MenuProps extends MuiMenuProps {}

export interface MenuItemProps extends MuiMenuItemProps {
  icon?: React.ReactNode;
}

export const Menu: React.FC<MenuProps> = (props) => {
  return <MuiMenu {...props} />;
};

export const MenuItem: React.FC<MenuItemProps> = ({ icon, children, ...props }) => {
  return (
    <MuiMenuItem {...props}>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText>{children}</ListItemText>
    </MuiMenuItem>
  );
};
