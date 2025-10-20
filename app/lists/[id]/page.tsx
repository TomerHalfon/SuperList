import React from 'react';
import { Container, Box, Divider } from '@mui/material';
import { ShoppingListHeader } from '@/components/features/ShoppingListHeader';
import { ShoppingListItem } from '@/components/features/ShoppingListItem';
import { Typography } from '@/components/ui/Typography';
import { Autocomplete, AutocompleteOption } from '@/components/ui/Autocomplete';
import { ShoppingList, ShoppingListItem as ShoppingListItemType, Item } from '@/types/shopping-list';
import { getListByIdAction } from '@/actions/lists';
import { getAllItemsAction } from '@/actions/items';
import { getItemDetails } from '@/lib/utils/list-helpers';
import { filterItemsBySearch } from '@/lib/utils/search-helpers';
import { generateSearchSuggestions, filterSuggestions } from '@/lib/utils/search-suggestions';
import { ListDetailClient } from './ListDetailClient';

interface ShoppingListDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ShoppingListDetailPage({ params }: ShoppingListDetailPageProps) {
  const resolvedParams = await params;
  
  // Fetch list and items data
  const [listResult, itemsResult] = await Promise.all([
    getListByIdAction(resolvedParams.id),
    getAllItemsAction()
  ]);

  if (!listResult.success || !listResult.data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mt: 4 }}>
          Shopping list not found
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
          {listResult.error || 'The shopping list you\'re looking for doesn\'t exist.'}
        </Typography>
      </Container>
    );
  }

  if (!itemsResult.success || !itemsResult.data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mt: 4 }}>
          Failed to load items
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 2 }}>
          {itemsResult.error || 'Unable to load item data.'}
        </Typography>
      </Container>
    );
  }

  const list = listResult.data;
  const items = itemsResult.data;

  // Generate search suggestions from items in this list only
  const listItemIds = new Set(list.items.map((item: ShoppingListItemType) => item.itemId));
  const listItems = items.filter((item: Item) => listItemIds.has(item.id));
  const allSuggestions = generateSearchSuggestions(listItems);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ListDetailClient 
        list={list}
        items={items}
        allSuggestions={allSuggestions}
      />
    </Container>
  );
}
