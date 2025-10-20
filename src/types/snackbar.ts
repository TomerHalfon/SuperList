export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export interface SnackbarMessage {
  id: string;
  message: string;
  severity: SnackbarSeverity;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface SnackbarContextType {
  showSuccess: (message: string, options?: Partial<Omit<SnackbarMessage, 'id' | 'message' | 'severity'>>) => void;
  showError: (message: string, options?: Partial<Omit<SnackbarMessage, 'id' | 'message' | 'severity'>>) => void;
  showWarning: (message: string, options?: Partial<Omit<SnackbarMessage, 'id' | 'message' | 'severity'>>) => void;
  showInfo: (message: string, options?: Partial<Omit<SnackbarMessage, 'id' | 'message' | 'severity'>>) => void;
  closeSnackbar: (id: string) => void;
}
