'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Fab } from '@/components/ui/Fab';
import { ShoppingListsGrid } from '@/components/features/ShoppingListsGrid';
import { DeleteListDialog } from '@/components/features/DeleteListDialog';
import { AppHeader } from '@/components/layout/AppHeader';
import { ShoppingList } from '@/types/shopping-list';
import { createListAction, deleteListAction } from '@/actions/lists';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { Add as AddIcon } from '@mui/icons-material';

interface HomeClientProps {
  lists: ShoppingList[];
  error?: string;
}

export function HomeClient({ lists, error }: HomeClientProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<ShoppingList | null>(null);
  const { showSuccess, showError } = useSnackbar();

  const handleCreateList = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append('name', 'New List');
      formData.append('items', JSON.stringify([]));
      
      const result = await createListAction(formData);
      
      if (result.success && result.data) {
        showSuccess('Shopping list created successfully');
        router.push(`/lists/${result.data.id}`);
      } else {
        console.error('Failed to create list:', result.error);
        showError(result.error || 'Failed to create shopping list');
      }
    } catch (error) {
      console.error('Error creating list:', error);
      showError('Failed to create shopping list');
    } finally {
      setIsCreating(false);
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
      const result = await deleteListAction(listToDelete.id);
      if (result.success) {
        showSuccess('Shopping list deleted successfully');
        setDeleteDialogOpen(false);
        setListToDelete(null);
        // The page will be revalidated automatically by the Server Action
      } else {
        console.error('Failed to delete list:', result.error);
        showError(result.error || 'Failed to delete shopping list');
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      showError('Failed to delete shopping list');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setListToDelete(null);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* <AppHeader /> */}
        
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error">
            Failed to load shopping lists
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {error}
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
        disabled={isCreating}
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
