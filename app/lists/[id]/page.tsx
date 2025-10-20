import React from 'react';
import { AutocompleteOption } from '@/components/ui/Autocomplete';
import { ShoppingList, ShoppingListItem as ShoppingListItemType, Item } from '@/types/shopping-list';
import { getListByIdAction } from '@/actions/lists';
import { getAllItemsAction } from '@/actions/items';
import { generateSearchSuggestions } from '@/lib/utils/search-suggestions';
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
      <div style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ textAlign: 'center', marginTop: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
            Shopping list not found
          </h1>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
            {listResult.error || 'The shopping list you\'re looking for doesn\'t exist.'}
          </p>
        </div>
      </div>
    );
  }

  if (!itemsResult.success || !itemsResult.data) {
    return (
      <div style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ textAlign: 'center', marginTop: '2rem', fontSize: '2rem', fontWeight: 'bold' }}>
            Failed to load items
          </h1>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#666' }}>
            {itemsResult.error || 'Unable to load item data.'}
          </p>
        </div>
      </div>
    );
  }

  const list = listResult.data;
  const items = itemsResult.data;

  // Generate search suggestions from items in this list only
  const listItemIds = new Set(list.items.map((item: ShoppingListItemType) => item.itemId));
  const listItems = items.filter((item: Item) => listItemIds.has(item.id));
  const allSuggestions = generateSearchSuggestions(listItems);

  return (
    <ListDetailClient 
      list={list}
      items={items}
      allSuggestions={allSuggestions}
    />
  );
}
