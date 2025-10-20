import React from 'react';
import { Box, Container } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@/components/ui/IconButton';
import { Typography } from '@/components/ui/Typography';
import { Progress } from '@/components/ui/Progress';
import { ShoppingList } from '@/types/shopping-list';
import { calculateCompletionPercentage } from '@/lib/utils/list-calculator';
import { formatRelativeDate } from '@/lib/utils/date-formatter';

export interface ShoppingListHeaderProps {
  list: ShoppingList;
  onBack: () => void;
}

export const ShoppingListHeader: React.FC<ShoppingListHeaderProps> = ({
  list,
  onBack,
}) => {
  const completionPercentage = calculateCompletionPercentage(list.items);

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        pb: 3,
        mb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={onBack}
            size="small"
            sx={{ mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {list.name}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="body2" color="textSecondary">
              Progress
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {completionPercentage}%
            </Typography>
          </Box>
          <Progress 
            value={completionPercentage} 
            size="small"
            sx={{
              '& .MuiLinearProgress-bar': {
                backgroundColor: completionPercentage === 100 ? '#4caf50' : '#1976d2',
              },
            }}
          />
        </Box>

        <Typography variant="body2" color="textSecondary">
          Updated {formatRelativeDate(list.updatedAt)} • {list.items.filter(item => item.collected).length} of {list.items.length} items collected
        </Typography>
      </Container>
    </Box>
  );
};
