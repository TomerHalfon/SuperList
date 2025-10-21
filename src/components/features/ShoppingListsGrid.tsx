import React from 'react';
import { Grid } from '@/components/ui/Grid';
import { Typography } from '@/components/ui/Typography';
import { ShoppingListCard } from './ShoppingListCard';
import { ShoppingList } from '@/types/shopping-list';

// ShoppingListsGrid component with delete functionality

export interface ShoppingListsGridProps {
  lists: ShoppingList[];
  onDeleteClick?: (listId: string) => void;
}

export const ShoppingListsGrid: React.FC<ShoppingListsGridProps> = ({ 
  lists,
  onDeleteClick
}) => {
  if (lists.length === 0) {
    return (
      <Grid container justifyContent="center" sx={{ py: 8 }}>
        <Grid xs={12} sm={8} md={6}>
          <Typography 
            variant="h6" 
            color="textSecondary" 
            align="center"
            sx={{ mb: 2 }}
          >
            No shopping lists yet
          </Typography>
          <Typography 
            variant="body2" 
            color="textSecondary" 
            align="center"
          >
            Create your first shopping list to get started!
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {lists.map((list) => (
        <Grid 
          key={list.id} 
          xs={12} 
          sm={6} 
          md={4} 
          lg={3}
        >
          <ShoppingListCard 
            list={list}
            onDeleteClick={onDeleteClick}
          />
        </Grid>
      ))}
    </Grid>
  );
};
