import React from 'react';
import Link from 'next/link';
import { Box } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Card, CardContent } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { Progress } from '@/components/ui/Progress';
import { IconButton } from '@/components/ui/IconButton';
import { ShoppingList } from '@/types/shopping-list';
import { calculateCompletionPercentage } from '@/lib/utils/list-calculator';
import { formatRelativeDate } from '@/lib/utils/date-formatter';

export interface ShoppingListCardProps {
  list: ShoppingList;
  onDeleteClick?: (listId: string) => void;
}

export const ShoppingListCard: React.FC<ShoppingListCardProps> = ({ 
  list,
  onDeleteClick
}) => {
  const completionPercentage = calculateCompletionPercentage(list.items);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteClick?.(list.id);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Link href={`/lists/${list.id}`} style={{ textDecoration: 'none' }}>
        <Card 
          hover 
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1,
              fontWeight: 600,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {list.name}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="textSecondary"
            sx={{ mb: 2 }}
          >
            Updated {formatRelativeDate(list.updatedAt)}
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="textSecondary">
                Progress
              </Typography>
              <Typography variant="caption" color="textSecondary">
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
          
          <Typography variant="caption" color="textSecondary">
            {list.items.filter(item => item.collected).length} of {list.items.length} items collected
          </Typography>
        </CardContent>
        
        {/* Delete button - positioned absolutely in top-right corner of the card */}
        {onDeleteClick && (
          <IconButton
            onClick={handleDeleteClick}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'background.paper',
              boxShadow: 2,
              opacity: 0.7,
              color: 'error.main',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
                opacity: 1,
                transform: 'scale(1.1)',
              },
            }}
            title="Delete list"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Card>
      </Link>
    </Box>
  );
};
