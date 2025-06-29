import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";

/**
 * A reusable confirmation dialog component
 * 
 * @param {Object} props Component props
 * @param {boolean} props.open Whether the dialog is open
 * @param {Function} props.onClose Callback when dialog is closed without confirmation
 * @param {Function} props.onConfirm Callback when dialog is confirmed
 * @param {string} props.title Dialog title
 * @param {string} props.message Dialog message
 * @param {string} props.confirmButtonText Text for the confirm button
 * @param {string} props.cancelButtonText Text for the cancel button
 * @param {string} props.confirmButtonColor Color for the confirm button (primary, secondary, error, etc.)
 */
export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirmation",
  message = "Are you sure you want to proceed?",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonColor = "primary"
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {cancelButtonText}
        </Button>
        <Button 
          onClick={onConfirm} 
          color={confirmButtonColor} 
          variant="contained" 
          autoFocus
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
