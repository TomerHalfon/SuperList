import React from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  DialogProps as MuiDialogProps,
  DialogTitleProps as MuiDialogTitleProps,
  DialogContentProps as MuiDialogContentProps,
  DialogActionsProps as MuiDialogActionsProps,
} from '@mui/material';

// Re-export MUI Dialog components with consistent naming
export interface DialogProps extends MuiDialogProps {}

export interface DialogTitleProps extends MuiDialogTitleProps {}

export interface DialogContentProps extends MuiDialogContentProps {}

export interface DialogActionsProps extends MuiDialogActionsProps {}

export const Dialog: React.FC<DialogProps> = (props) => {
  return <MuiDialog {...props} />;
};

export const DialogTitle: React.FC<DialogTitleProps> = (props) => {
  return <MuiDialogTitle {...props} />;
};

export const DialogContent: React.FC<DialogContentProps> = (props) => {
  return <MuiDialogContent {...props} />;
};

export const DialogActions: React.FC<DialogActionsProps> = (props) => {
  return <MuiDialogActions {...props} />;
};
