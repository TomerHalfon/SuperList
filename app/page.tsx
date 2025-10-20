import React from 'react';
import { getAllListsAction } from '@/actions/lists';
import { initializeStorage } from '@/lib/storage';
import { HomeClient } from './HomeClient';

export default async function Home() {
  // Initialize storage on first load
  await initializeStorage();
  
  // Fetch all shopping lists
  const result = await getAllListsAction();
  
  return (
    <HomeClient 
      lists={result.data || []} 
      error={result.success ? undefined : result.error}
    />
  );
}
