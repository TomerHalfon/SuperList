import React from 'react';
import { initializeStorage } from '@/lib/storage';
import { HomeClient } from './HomeClient';

export default async function Home() {
  // Initialize storage on first load (only needed for JSON storage)
  await initializeStorage();
  
  // Data fetching is now handled by React Query in HomeClient
  return <HomeClient />;
}
