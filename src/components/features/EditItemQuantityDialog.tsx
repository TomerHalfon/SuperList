import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Box } from '@/components/ui/Box';
import { Item } from '@/types/shopping-list';

export interface EditItemQuantityDialogProps {
  open: boolean;
  item: Item | null;
  currentQuantity: number;
  onClose: () => void;
  onSave: (newQuantity: number) => void;
}

export const EditItemQuantityDialog: React.FC<EditItemQuantityDialogProps> = ({
  open,
  item,
  currentQuantity,
  onClose,
  onSave,
}) => {
  const [quantity, setQuantity] = useState(currentQuantity.toString());
  const [error, setError] = useState<string | null>(null);

  // Update quantity when dialog opens or currentQuantity changes
  useEffect(() => {
    if (open) {
      setQuantity(currentQuantity.toString());
      setError(null);
    }
  }, [open, currentQuantity]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuantity(value);
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const validateQuantity = (value: string): string | null => {
    const num = parseInt(value, 10);
    
    if (isNaN(num) || value.trim() === '') {
      return 'Please enter a valid number';
    }
    
    if (num < 1) {
      return 'Quantity must be at least 1';
    }
    
    if (num > 999) {
      return 'Quantity cannot exceed 999';
    }
    
    return null;
  };

  const handleSave = () => {
    const validationError = validateQuantity(quantity);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newQuantity = parseInt(quantity, 10);
    onSave(newQuantity);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!item) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      title="Edit Quantity"
      // Make dialog more mobile-friendly
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: 2, sm: 3 },
          maxHeight: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 48px)' },
        }
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Item display */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
          <Typography
            component="span"
            sx={{ fontSize: { xs: '1.5em', sm: '2em' }, mr: 2 }}
          >
            {item.emoji}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            {item.name}
          </Typography>
        </Box>

        {/* Quantity input */}
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          onKeyDown={handleKeyPress}
          error={!!error}
          helperText={error || 'Enter a quantity between 1 and 999'}
          inputProps={{
            min: 1,
            max: 999,
            step: 1,
          }}
          autoFocus
          sx={{ 
            mb: { xs: 2, sm: 3 },
            '& .MuiInputBase-input': {
              fontSize: { xs: '1rem', sm: '1rem' },
              padding: { xs: '12px 14px', sm: '16.5px 14px' },
            }
          }}
        />

        {/* Action buttons */}
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 1, sm: 2 }, 
          justifyContent: 'flex-end',
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{ 
              minHeight: { xs: 44, sm: 36 },
              fontSize: { xs: '1rem', sm: '0.875rem' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!!error || quantity === currentQuantity.toString()}
            sx={{ 
              minHeight: { xs: 44, sm: 36 },
              fontSize: { xs: '1rem', sm: '0.875rem' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
