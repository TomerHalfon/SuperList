import React from 'react';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@/components/ui/Dialog';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export interface DeleteListDialogProps {
  open: boolean;
  listName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Pool of funny warning messages - will be replaced with translations
const getFunnyMessages = (t: any) => [
  t('shoppingCartGraveyard'),
  t('futureSelfRegret'),
  t('unlikeImpulsePurchases'),
  t('meetItsMaker'),
  t('digitalVoid'),
  t('throwingAwayCart'),
  t('listHasFeelings'),
  t('emptyFridgeSyndrome'),
  t('digitalDust'),
  t('groceryStoreMiss'),
];

export const DeleteListDialog: React.FC<DeleteListDialogProps> = ({
  open,
  listName,
  onConfirm,
  onCancel,
}) => {
  const t = useTranslations('dialogs');
  const tWarnings = useTranslations('deleteWarnings');
  
  // Get a random funny message
  const funnyMessages = getFunnyMessages(tWarnings);
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
        {t('deleteShoppingList')}
      </DialogTitle>
      
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('youreAboutToDelete')} <strong>"{listName}"</strong>
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
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          color="error"
          startIcon={<DeleteIcon />}
        >
          {t('deleteList')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
