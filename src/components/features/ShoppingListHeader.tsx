import React, { useState, useRef, useEffect } from 'react';
import { ArrowBack, Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { Box } from '@/components/ui/Box';
import { Container } from '@/components/ui/Container';
import { IconButton } from '@/components/ui/IconButton';
import { Typography } from '@/components/ui/Typography';
import { TextField } from '@/components/ui/TextField';
import { Progress } from '@/components/ui/Progress';
import { ShoppingList } from '@/types/shopping-list';
import { calculateCompletionPercentage } from '@/lib/utils/list-calculator';
import { formatRelativeDate } from '@/lib/utils/date-formatter';
import { z } from 'zod';

const listNameSchema = z.string().min(1, 'Name is required').max(100, 'Name too long');

export interface ShoppingListHeaderProps {
  list: ShoppingList;
  onBack: () => void;
  onNameUpdate?: (newName: string) => void;
}

export const ShoppingListHeader: React.FC<ShoppingListHeaderProps> = ({
  list,
  onBack,
  onNameUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(list.name);
  const [error, setError] = useState<string | null>(null);
  const textFieldRef = useRef<HTMLInputElement>(null);
  
  const completionPercentage = calculateCompletionPercentage(list.items);

  // Focus the text field when editing starts
  useEffect(() => {
    if (isEditing && textFieldRef.current) {
      textFieldRef.current.focus();
      // Use setTimeout to ensure the input is rendered before selecting
      setTimeout(() => {
        if (textFieldRef.current) {
          textFieldRef.current.select();
        }
      }, 0);
    }
  }, [isEditing]);

  const handleEditStart = () => {
    setEditValue(list.name);
    setError(null);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditValue(list.name);
    setError(null);
    setIsEditing(false);
  };

  const handleEditSave = () => {
    try {
      const validatedName = listNameSchema.parse(editValue.trim());
      if (validatedName !== list.name && onNameUpdate) {
        onNameUpdate(validatedName);
      }
      setIsEditing(false);
      setError(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message || 'Invalid name');
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleEditSave();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleEditCancel();
    }
  };

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
          
          {isEditing ? (
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 1 }}>
              <TextField
                ref={textFieldRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                error={!!error}
                helperText={error}
                variant="standard"
                sx={{
                  flex: 1,
                  '& .MuiInputBase-input': {
                    fontSize: '2rem',
                    fontWeight: 600,
                    padding: 0,
                  },
                  '& .MuiInput-underline:before': {
                    borderBottom: '2px solid',
                    borderBottomColor: 'primary.main',
                  },
                }}
              />
              <IconButton
                onClick={handleEditSave}
                size="small"
                color="primary"
                disabled={!editValue.trim()}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                onClick={handleEditCancel}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, flex: 1 }}>
                {list.name}
              </Typography>
              {onNameUpdate && (
                <IconButton
                  onClick={handleEditStart}
                  size="small"
                  sx={{ ml: 1 }}
                  title="Edit list name"
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          )}
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
