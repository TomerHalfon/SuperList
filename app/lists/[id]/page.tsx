import React from 'react';
import { ListDetailClient } from './ListDetailClient';

interface ShoppingListDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ShoppingListDetailPage({ params }: ShoppingListDetailPageProps) {
  const resolvedParams = await params;
  
  // Data fetching is now handled by React Query in ListDetailClient
  return <ListDetailClient listId={resolvedParams.id} />;
}
