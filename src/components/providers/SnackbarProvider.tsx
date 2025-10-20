'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Snackbar } from '@/components/ui/Snackbar';
import { Alert } from '@/components/ui/Alert';
import { IconButton } from '@/components/ui/IconButton';
import { Close as CloseIcon } from '@mui/icons-material';
import { SnackbarMessage, SnackbarContextType, SnackbarSeverity } from '@/types/snackbar';

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<SnackbarMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<SnackbarMessage | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showMessage = useCallback((
    message: string, 
    severity: SnackbarSeverity, 
    options?: Partial<Omit<SnackbarMessage, 'id' | 'message' | 'severity'>>
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newMessage: SnackbarMessage = {
      id,
      message,
      severity,
      duration: 5000, // Default 5 seconds
      ...options,
    };

    setMessages(prev => [...prev, newMessage]);
  }, []);

  const showSuccess = useCallback((message: string, options?: Partial<Omit<SnackbarMessage, 'id' | 'message' | 'severity'>>) => {
    showMessage(message, 'success', options);
  }, [showMessage]);

  const showError = useCallback((message: string, options?: Partial<Omit<SnackbarMessage, 'id' | 'message' | 'severity'>>) => {
    showMessage(message, 'error', options);
  }, [showMessage]);

  const showWarning = useCallback((message: string, options?: Partial<Omit<SnackbarMessage, 'id' | 'message' | 'severity'>>) => {
    showMessage(message, 'warning', options);
  }, [showMessage]);

  const showInfo = useCallback((message: string, options?: Partial<Omit<SnackbarMessage, 'id' | 'message' | 'severity'>>) => {
    showMessage(message, 'info', options);
  }, [showMessage]);

  const closeSnackbar = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
    if (currentMessage?.id === id) {
      setCurrentMessage(null);
    }
  }, [currentMessage]);

  const handleClose = useCallback((event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    if (currentMessage) {
      closeSnackbar(currentMessage.id);
    }
  }, [currentMessage, closeSnackbar]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (currentMessage && !isHovered) {
      startAutoHide();
    }
  }, [currentMessage, isHovered]);

  const startAutoHide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (currentMessage && currentMessage.duration && !isHovered) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, currentMessage.duration);
    }
  }, [currentMessage, isHovered, handleClose]);

  // Process message queue
  useEffect(() => {
    if (messages.length > 0 && !currentMessage) {
      const nextMessage = messages[0];
      setCurrentMessage(nextMessage);
      setMessages(prev => prev.slice(1));
    }
  }, [messages, currentMessage]);

  // Start auto-hide when message changes
  useEffect(() => {
    if (currentMessage) {
      startAutoHide();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentMessage, startAutoHide]);

  const contextValue: SnackbarContextType = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeSnackbar,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      
      {currentMessage && (
        <Snackbar
          open={!!currentMessage}
          onClose={handleClose}
          autoHideDuration={null} // We handle this manually
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            '& .MuiSnackbarContent-root': {
              padding: 0,
            },
          }}
        >
          <Alert
            severity={currentMessage.severity}
            onClose={() => handleClose()}
            action={
              currentMessage.action ? (
                <IconButton
                  size="small"
                  onClick={currentMessage.action.onClick}
                  color="inherit"
                >
                  {currentMessage.action.label}
                </IconButton>
              ) : undefined
            }
            sx={{
              minWidth: 300,
              maxWidth: 500,
              '& .MuiAlert-message': {
                flex: 1,
              },
            }}
          >
            {currentMessage.message}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
