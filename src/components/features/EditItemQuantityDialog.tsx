import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Box } from '@/components/ui/Box';
import { Collapse } from '@/components/ui/Collapse';
import { Autocomplete, AutocompleteOption } from '@/components/ui/Autocomplete';
import { Item } from '@/types/shopping-list';
import { getAllItemsAction } from '@/actions/items';
import { updateItemAction } from '@/actions/items';
import { extractUniqueTags } from '@/lib/utils/tag-helpers';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useTheme } from '@/hooks/useTheme';
import EmojiPicker, { SkinTonePickerLocation, Theme } from 'emoji-picker-react';

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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTags, setSelectedTags] = useState<AutocompleteOption[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const { showSuccess, showError } = useSnackbar();
  const { theme } = useTheme();

  // Map app themes to emoji picker themes
  const getEmojiPickerTheme = (appTheme: string): Theme => {
    switch (appTheme) {
      case 'dark':
      case 'purple-night':
      case 'cyberpunk':
        return Theme.DARK;
      case 'light':
      case 'ocean-blue':
      case 'sunset-orange':
      case 'forest-green':
      case 'high-contrast':
      case 'retro':
        return Theme.LIGHT;
      default:
        return Theme.AUTO;
    }
  };

  // Update quantity when dialog opens or currentQuantity changes
  useEffect(() => {
    if (open) {
      setQuantity(currentQuantity.toString());
      setError(null);
      setShowAdvanced(false);
      
      // Initialize advanced settings with current item data
      if (item) {
        setSelectedEmoji(item.emoji);
        setSelectedTags(
          item.tags.map(tag => ({
            label: tag,
            value: tag,
            type: 'tag' as const
          }))
        );
      }
    }
  }, [open, currentQuantity, item]);

  // Load all items for tag options
  useEffect(() => {
    if (open && allItems.length === 0) {
      loadAllItems();
    }
  }, [open, allItems.length]);

  const loadAllItems = useCallback(async () => {
    setIsLoadingItems(true);
    try {
      const result = await getAllItemsAction();
      if (result.success && result.data) {
        setAllItems(result.data);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setIsLoadingItems(false);
    }
  }, []);

  // Create tag options from all items
  const tagOptions = useMemo(() => {
    const uniqueTags = extractUniqueTags(allItems);
    return uniqueTags.map(tag => ({
      label: tag,
      value: tag,
      type: 'tag' as const
    }));
  }, [allItems]);

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

  const handleTagsChange = useCallback((event: React.SyntheticEvent, value: AutocompleteOption | AutocompleteOption[] | null) => {
    if (Array.isArray(value)) {
      setSelectedTags(value);
    } else {
      setSelectedTags([]);
    }
  }, []);

  const handleEmojiSelect = useCallback((emojiData: any) => {
    setSelectedEmoji(emojiData.emoji);
    setShowEmojiPicker(false);
  }, []);

  const hasMetadataChanged = useCallback(() => {
    if (!item) return false;
    
    const tagsChanged = JSON.stringify(selectedTags.map(t => t.value).sort()) !== 
                       JSON.stringify(item.tags.sort());
    const emojiChanged = selectedEmoji !== item.emoji;
    
    return tagsChanged || emojiChanged;
  }, [item, selectedTags, selectedEmoji]);

  const hasQuantityChanged = useCallback(() => {
    return parseInt(quantity, 10) !== currentQuantity;
  }, [quantity, currentQuantity]);

  const handleSave = async () => {
    const validationError = validateQuantity(quantity);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newQuantity = parseInt(quantity, 10);
    
    // Update item metadata if changed
    if (item && hasMetadataChanged()) {
      try {
        const formData = new FormData();
        formData.append('emoji', selectedEmoji);
        formData.append('tags', JSON.stringify(selectedTags.map(t => t.value)));
        
        const result = await updateItemAction(item.id, formData);
        if (!result.success) {
          showError(result.error || 'Failed to update item settings');
          return;
        }
        showSuccess('Item settings updated successfully');
      } catch (error) {
        console.error('Failed to update item:', error);
        showError('Failed to update item settings');
        return;
      }
    }

    // Update quantity
    onSave(newQuantity);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      if (showEmojiPicker) {
        setShowEmojiPicker(false);
      } else {
        onClose();
      }
    }
  };

  const handleClose = () => {
    setError(null);
    setShowAdvanced(false);
    setShowEmojiPicker(false);
    onClose();
  };

  const isSaveDisabled = useCallback(() => {
    return !!error || (!hasQuantityChanged() && !hasMetadataChanged());
  }, [error, hasQuantityChanged, hasMetadataChanged]);

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

        {/* Advanced Settings Toggle */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Button
            variant="text"
            onClick={() => setShowAdvanced(!showAdvanced)}
            sx={{ 
              p: 0, 
              minWidth: 'auto',
              textTransform: 'none',
              fontSize: { xs: '0.875rem', sm: '0.875rem' },
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            {showAdvanced ? '▼' : '▶'} Advanced Settings
          </Button>
        </Box>

        {/* Advanced Settings Content */}
        <Collapse in={showAdvanced}>
          <Box sx={{ 
            p: { xs: 2, sm: 3 }, 
            backgroundColor: 'background.paper', 
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            mb: { xs: 2, sm: 3 }
          }}>
            {/* Emoji Section */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                Emoji
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  component="span"
                  sx={{ 
                    fontSize: { xs: '2em', sm: '2.5em' },
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    borderRadius: 1,
                    p: 1,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'primary.50'
                    }
                  }}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  {selectedEmoji}
                </Typography>
              </Box>
              
              {/* Emoji Picker Overlay */}
              {showEmojiPicker && (
                <Box sx={{ 
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'rgba(0, 0, 0, 0.8)' 
                      : 'rgba(0, 0, 0, 0.5)',
                  '& .emoji-picker-react': {
                    boxShadow: (theme) => theme.shadows[8],
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'divider',
                    fontFamily: 'inherit !important',
                    '& .emoji': {
                      fontFamily: 'inherit !important',
                      fontSize: 'inherit !important'
                    },
                    '& .emoji-picker-emoji': {
                      fontFamily: 'inherit !important',
                      fontSize: 'inherit !important'
                    },
                    '& .emoji-picker-emoji-content': {
                      fontFamily: 'inherit !important',
                      fontSize: 'inherit !important'
                    }
                  }
                }}
                onClick={(e) => {
                  // Close picker when clicking outside
                  if (e.target === e.currentTarget) {
                    setShowEmojiPicker(false);
                  }
                }}>
                  <EmojiPicker
                    onEmojiClick={handleEmojiSelect}
                    width={300}
                    height={400}
                    searchDisabled={false}
                    skinTonesDisabled={false}
                    previewConfig={{
                      showPreview: true,
                      defaultCaption: "Select an emoji",
                    }}
                    skinTonePickerLocation={SkinTonePickerLocation.PREVIEW}
                    theme={getEmojiPickerTheme(theme)}
                  />
                </Box>
              )}
            </Box>

            {/* Tags Section */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
                Tags
              </Typography>
              <Autocomplete
                multiple
                freeSolo
                fullWidth
                placeholder="Select or add tags..."
                value={selectedTags}
                onChange={handleTagsChange}
                options={tagOptions}
                size="small"
                noOptionsText="Type to add a new tag"
                loadingText="Loading tags..."
                disabled={isLoadingItems}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    minHeight: 'auto',
                    '& .MuiAutocomplete-input': {
                      padding: '8px 4px'
                    }
                  }
                }}
              />
            </Box>
          </Box>
        </Collapse>

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
            disabled={isSaveDisabled()}
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
