'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Fab } from '@/components/ui/Fab';
import { ShoppingListsGrid } from '@/components/features/ShoppingListsGrid';
import { ShoppingListsGridSkeleton } from '@/components/features/ShoppingListsGridSkeleton';
import { DeleteListDialog } from '@/components/features/DeleteListDialog';
import { ShoppingList } from '@/types/shopping-list';
import { useLists, useCreateList, useDeleteList } from '@/hooks/useLists';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useTranslations } from 'next-intl';
import { Add as AddIcon } from '@mui/icons-material';

export function HomeClient() {
  const t = useTranslations('lists');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<ShoppingList | null>(null);
  const { showSuccess, showError } = useSnackbar();
  
  // Use React Query hooks
  const { data: lists = [], isLoading, error } = useLists();
  const createListMutation = useCreateList();
  const deleteListMutation = useDeleteList();

  const handleCreateList = async () => {
    try {
      await createListMutation.mutateAsync(t('newList'));
      showSuccess(t('listCreatedSuccessfully'));
    } catch (error) {
      console.error('Error creating list:', error);
      showError(error instanceof Error ? error.message : t('failedToCreateList'));
    }
  };

  const handleDeleteClick = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      setListToDelete(list);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!listToDelete) return;
    
    try {
      await deleteListMutation.mutateAsync(listToDelete.id);
      showSuccess(t('listDeletedSuccessfully'));
      setDeleteDialogOpen(false);
      setListToDelete(null);
    } catch (error) {
      console.error('Error deleting list:', error);
      showError(error instanceof Error ? error.message : t('failedToDeleteList'));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setListToDelete(null);
  };

  // Loading state
  if (isLoading) {
    return <ShoppingListsGridSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error">
            {t('failedToLoadLists')}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {error instanceof Error ? error.message : t('anErrorOccurred')}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg">      
        <ShoppingListsGrid 
          lists={lists}
          onDeleteClick={handleDeleteClick}
        />
      </Container>
      
      <Fab
        onClick={handleCreateList}
        disabled={createListMutation.isPending}
        aria-label="Create new shopping list"
      >
        <AddIcon />
      </Fab>

      {/* Delete confirmation dialog */}
      {listToDelete && (
        <DeleteListDialog
          open={deleteDialogOpen}
          listName={listToDelete.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  );
}
