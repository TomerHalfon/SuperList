import React from 'react';
import { Container } from '@/components/ui/Container';
import { Box } from '@/components/ui/Box';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Skeleton component for the shopping list detail page
 * Mimics the layout of ShoppingListHeader, search field, and ShoppingListItem components
 */
export const ShoppingListDetailSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg">
      {/* Header skeleton */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          pb: 3,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {/* Back button skeleton */}
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40} 
            sx={{ mr: 1 }}
          />
          
          {/* Title skeleton */}
          <Skeleton 
            variant="text" 
            width="60%" 
            height={48} 
            sx={{ flex: 1 }}
          />
          
          {/* Edit button skeleton */}
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40} 
            sx={{ ml: 1 }}
          />
        </Box>

        {/* Progress section skeleton */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Skeleton variant="text" width="15%" height={20} />
            <Skeleton variant="text" width="10%" height={20} />
          </Box>
          <Skeleton 
            variant="rectangular" 
            height={6} 
            sx={{ borderRadius: 3, mb: 1 }}
          />
        </Box>

        {/* Updated date and items count skeleton */}
        <Skeleton 
          variant="text" 
          width="50%" 
          height={20} 
        />
      </Box>

      {/* Search field skeleton */}
      <Box sx={{ mb: 3 }}>
        <Skeleton 
          variant="rectangular" 
          height={56} 
          sx={{ borderRadius: 1 }}
        />
      </Box>

      <Box>
        {/* "Items to collect" section skeleton */}
        <Box sx={{ mb: 3 }}>
          <Skeleton 
            variant="text" 
            width="40%" 
            height={32} 
            sx={{ mb: 2 }}
          />
          
          {/* Add item field skeleton */}
          <Skeleton 
            variant="rectangular" 
            height={40} 
            sx={{ borderRadius: 1, mb: 2 }}
          />
        </Box>

        {/* Item rows skeleton */}
        {Array.from({ length: 6 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              py: 1.5,
              px: 2,
              borderRadius: 1,
              mb: 1,
            }}
          >
            {/* Checkbox skeleton */}
            <Skeleton 
              variant="circular" 
              width={20} 
              height={20} 
              sx={{ mr: 1 }}
            />
            
            {/* Item content skeleton */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Emoji skeleton */}
              <Skeleton 
                variant="circular" 
                width={24} 
                height={24} 
              />
              
              {/* Item name skeleton */}
              <Skeleton 
                variant="text" 
                width={`${60 + Math.random() * 30}%`} 
                height={24} 
              />
            </Box>

            {/* Quantity controls skeleton */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              ml: 1,
            }}>
              <Skeleton 
                variant="circular" 
                width={24} 
                height={24} 
              />
              <Skeleton 
                variant="text" 
                width={20} 
                height={20} 
              />
              <Skeleton 
                variant="circular" 
                width={24} 
                height={24} 
              />
              <Skeleton 
                variant="circular" 
                width={24} 
                height={24} 
                sx={{ ml: 0.5 }}
              />
            </Box>
          </Box>
        ))}

        {/* Delete button skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
          <Skeleton 
            variant="rectangular" 
            width={200} 
            height={48} 
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </Box>
    </Container>
  );
};
