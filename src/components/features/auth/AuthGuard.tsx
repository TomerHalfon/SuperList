'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box } from '@/components/ui/Box';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { onAuthStateChange } from '@/lib/auth/auth-helpers';
import type { User } from '@/types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component to protect routes and handle authentication state
 * This is a client-side guard for immediate feedback
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/auth/callback'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    let initialCheckDone = false;

    // Subscribe to auth changes - this also fires immediately with current session
    const subscription = onAuthStateChange((event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // Only handle redirects after initial check
      if (!initialCheckDone) {
        initialCheckDone = true;
        setLoading(false);
        
        // Redirect if not authenticated and trying to access protected route
        if (!currentUser && !isPublicRoute) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        }
      } else {
        // Handle subsequent auth state changes
        if (event === 'SIGNED_IN') {
          // User signed in, do nothing (middleware/server action handles redirect)
        } else if (event === 'SIGNED_OUT') {
          // User signed out
          if (!isPublicRoute) {
            router.push('/login');
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router, isPublicRoute]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If on a public route, always render children
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Only render children if authenticated
  if (user) {
    return <>{children}</>;
  }

  // Loading state while redirecting
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

