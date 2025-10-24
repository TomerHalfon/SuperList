import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Edit as EditIcon } from '@mui/icons-material';
import { Checkbox } from '@/components/ui/Checkbox';
import { Typography } from '@/components/ui/Typography';
import { IconButton } from '@/components/ui/IconButton';
import { Item } from '@/types/shopping-list';

export interface ShoppingListItemProps {
  item: Item;
  quantity: number;
  collected: boolean;
  onToggle: (itemId: string) => void;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onEditClick: (itemId: string, currentQuantity: number) => void;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  item,
  quantity,
  collected,
  onToggle,
  onQuantityChange,
  onEditClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    onToggle(item.id);
  };

  const handleIncrement = () => {
    if (quantity < 999) {
      onQuantityChange(item.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(item.id, quantity - 1);
    }
  };

  const handleEditClick = () => {
    onEditClick(item.id, quantity);
  };

  return (
    <Box
      data-testid={`shopping-list-item-${item.name}`}
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

      {/* Quantity controls - show on hover for desktop, always visible on mobile */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 0.5, 
        ml: 1,
        // Show on hover for desktop, always visible on mobile
        opacity: { xs: 1, sm: isHovered ? 1 : 0 },
        transition: 'opacity 0.2s ease-in-out',
        // Ensure buttons are touch-friendly on mobile
        '& .MuiIconButton-root': {
          width: { xs: 32, sm: 24 },
          height: { xs: 32, sm: 24 },
          minWidth: { xs: 32, sm: 24 },
          minHeight: { xs: 32, sm: 24 },
        }
      }}>
        <IconButton
          size="small"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          data-testid="decrement-quantity-button"
          sx={{ 
            opacity: quantity <= 1 ? 0.3 : 1,
          }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        
        <Typography
          variant="body2"
          sx={{ 
            minWidth: 20, 
            textAlign: 'center',
            fontWeight: 500,
            // Make quantity more prominent on mobile
            fontSize: { xs: '0.875rem', sm: '0.75rem' },
          }}
        >
          {quantity}
        </Typography>
        
        <IconButton
          size="small"
          onClick={handleIncrement}
          disabled={quantity >= 999}
          data-testid="increment-quantity-button"
          sx={{ 
            opacity: quantity >= 999 ? 0.3 : 1,
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
        
        <IconButton
          size="small"
          onClick={handleEditClick}
          data-testid="edit-item-button"
          sx={{ 
            ml: 0.5,
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};
