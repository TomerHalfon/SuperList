import React from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@/components/ui/Dialog';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

export interface DeleteListDialogProps {
  open: boolean;
  listName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Pool of funny warning messages
const funnyMessages = [
  "Are you sure? This list will go to the shopping cart graveyard! ⚰️🛒",
  "Delete this list? Your future self might regret this decision! 😱",
  "Warning: Deleted lists cannot be un-deleted. Unlike your impulse purchases. 🛍️",
  "This list is about to meet its maker... are you absolutely sure? 🙏",
  "Once deleted, this list joins the digital void. No refunds! 🕳️",
  "Delete this list? It's like throwing away a perfectly good shopping cart! 🛒💔",
  "Are you sure? This list has feelings too! (Well, not really, but still...) 😢",
  "Warning: Deleting this list may cause temporary sadness and empty fridge syndrome! 🥛",
  "This list is about to become one with the digital dust. Proceed? ✨",
  "Delete this list? Your grocery store will miss the business! 🏪",
];

export const DeleteListDialog: React.FC<DeleteListDialogProps> = ({
  open,
  listName,
  onConfirm,
  onCancel,
}) => {
  // Get a random funny message
  const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DeleteIcon color="error" />
        Delete Shopping List
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You're about to delete <strong>"{listName}"</strong>
        </Typography>
        
        <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
          {randomMessage}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ gap: 1, px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          color="error"
          startIcon={<DeleteIcon />}
        >
          Delete List
        </Button>
      </DialogActions>
    </Dialog>
  );
};
