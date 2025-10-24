'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { AppHeader } from './AppHeader';

/**
 * ConditionalAppHeader component that only renders the AppHeader
 * for non-auth pages to avoid duplicate language switchers
 */
export const ConditionalAppHeader: React.FC = () => {
  const pathname = usePathname();
  
  // Public routes that don't need the main AppHeader
  const publicRoutes = ['/login', '/signup', '/auth/callback'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Don't render AppHeader for auth pages
  if (isPublicRoute) {
    return null;
  }
  
  // Render AppHeader for all other pages
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <AppHeader />
    </Container>
  );
};
