import React from 'react';
import { Container, Box } from '@mui/material';
import { Typography } from '@/components/ui/Typography';
import { ShoppingListsGrid } from '@/components/features/ShoppingListsGrid';
import { getAllListsAction } from '@/actions/lists';
import { initializeStorage } from '@/lib/storage';

export default async function Home() {
  // Initialize storage on first load
  await initializeStorage();
  
  // Fetch all shopping lists
  const result = await getAllListsAction();
  
  if (!result.success) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
            SuperList
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Your Shopping Lists Dashboard
          </Typography>
        </Box>
        
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="error">
            Failed to load shopping lists
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {result.error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
          SuperList
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Your Shopping Lists Dashboard
        </Typography>
      </Box>
      
      <ShoppingListsGrid 
        lists={result.data || []} 
      />
    </Container>
  );
}
