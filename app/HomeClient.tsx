'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Box } from '@/components/ui/Box';
import { Typography } from '@/components/ui/Typography';
import { ShoppingListsGrid } from '@/components/features/ShoppingListsGrid';
import { AppHeader } from '@/components/layout/AppHeader';
import { ShoppingList } from '@/types/shopping-list';

interface HomeClientProps {
  lists: ShoppingList[];
  error?: string;
}

export function HomeClient({ lists, error }: HomeClientProps) {
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <AppHeader />
        
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AppHeader />
      
      <ShoppingListsGrid 
        lists={lists} 
      />
    </Container>
  );
}
