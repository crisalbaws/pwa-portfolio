import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackBarProps {
    open: boolean;
    message: string;
    duration?: number;
    onClose: () => void;
    type: 'error' | 'warning' | 'info' | 'success';
}

export const SnackBar: React.FC<SnackBarProps> = ({ open, message, duration = 3000, onClose, type }: SnackBarProps) => {
    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: string,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={handleClose} severity={type} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackBar;
