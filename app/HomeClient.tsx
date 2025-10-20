'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { Fab } from '@/components/ui/Fab';
import { ShoppingListsGrid } from '@/components/features/ShoppingListsGrid';
import { AppHeader } from '@/components/layout/AppHeader';
import { ShoppingList } from '@/types/shopping-list';
import { createListAction } from '@/actions/lists';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { Add as AddIcon } from '@mui/icons-material';

interface HomeClientProps {
  lists: ShoppingList[];
  error?: string;
}

export function HomeClient({ lists, error }: HomeClientProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
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
        />
      </Container>
      
      <Fab
        onClick={handleCreateList}
        disabled={isCreating}
        aria-label="Create new shopping list"
      >
        <AddIcon />
      </Fab>
    </>
  );
}
