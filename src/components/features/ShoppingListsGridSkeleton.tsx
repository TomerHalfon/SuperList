import React from 'react';
import { Container } from '@/components/ui/Container';
import { Grid } from '@/components/ui/Grid';
import { Skeleton } from '@/components/ui/Skeleton';
import { Box } from '@/components/ui/Box';

/**
 * Skeleton component for the shopping lists grid on the home page
 * Mimics the layout of ShoppingListCard components
 */
export const ShoppingListsGridSkeleton: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid key={index} xs={12} sm={6} md={4}>
            <Box sx={{ position: 'relative' }}>
              {/* Card container skeleton */}
              <Box
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {/* List name skeleton */}
                <Skeleton 
                  variant="text" 
                  width="80%" 
                  height={28} 
                  sx={{ mb: 1 }}
                />
                
                {/* Update date skeleton */}
                <Skeleton 
                  variant="text" 
                  width="60%" 
                  height={20} 
                  sx={{ mb: 2 }}
                />
                
                {/* Progress section */}
                <Box sx={{ mb: 1 }}>
                  {/* Progress label and percentage */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Skeleton variant="text" width="20%" height={16} />
                    <Skeleton variant="text" width="15%" height={16} />
                  </Box>
                  
                  {/* Progress bar skeleton */}
                  <Skeleton 
                    variant="rectangular" 
                    height={6} 
                    sx={{ borderRadius: 3, mb: 1 }}
                  />
                </Box>
                
                {/* Items count skeleton */}
                <Skeleton 
                  variant="text" 
                  width="70%" 
                  height={16} 
                />
                
                {/* Delete button skeleton */}
                <Skeleton 
                  variant="circular" 
                  width={32} 
                  height={32}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
