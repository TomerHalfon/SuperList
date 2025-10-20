import React from 'react';
import { Box } from '@mui/material';
import { Checkbox } from '@/components/ui/Checkbox';
import { Typography } from '@/components/ui/Typography';
import { Item } from '@/types/shopping-list';

export interface ShoppingListItemProps {
  item: Item;
  quantity: number;
  collected: boolean;
  onToggle: (itemId: string) => void;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  item,
  quantity,
  collected,
  onToggle,
}) => {
  const handleToggle = () => {
    onToggle(item.id);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 1.5,
        px: 2,
        backgroundColor: collected ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
        borderRadius: 1,
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: collected ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <Checkbox
        checked={collected}
        onChange={handleToggle}
        size="small"
        sx={{ mr: 1 }}
      />
      
      <Typography
        variant="body1"
        sx={{
          flexGrow: 1,
          textDecoration: collected ? 'line-through' : 'none',
          color: collected ? 'text.secondary' : 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <span style={{ fontSize: '1.2em' }}>{item.emoji}</span>
        {item.name}
        {quantity > 1 && (
          <Typography
            component="span"
            variant="body2"
            color="textSecondary"
            sx={{ ml: 0.5 }}
          >
            (×{quantity})
          </Typography>
        )}
      </Typography>
    </Box>
  );
};
