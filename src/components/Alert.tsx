import React from 'react';
import { makeStyles } from '@mui/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface AlertComponentProps {
    open: boolean;
    onClose: () => void;
}

const useStyles = makeStyles({
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
    },
    infoText: {
        marginBottom: '10px',
        fontSize: '1rem',
    },
});

const AlertComponent: React.FC<AlertComponentProps> = ({ open, onClose }) => {
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Account Information</DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography className={classes.infoText}>Correo: demo@portfolio.com</Typography>
                <Typography className={classes.infoText}>Contraseña: 123456Ab</Typography>
            </DialogContent>
            <DialogActions>
                <Button sx={{ background: '#418091' }} onClick={onClose} color="primary" variant="contained">
                    Aceptar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertComponent;
