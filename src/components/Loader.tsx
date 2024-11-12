import React, { useEffect, useState } from 'react';
import { CircularProgress, Backdrop } from '@mui/material';

const Loader: React.FC = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleShowSpinner = (event: CustomEvent) => {
            setLoading(event.detail.showSpinner);
        };
        window.addEventListener('showSpinner', handleShowSpinner as EventListener);
        return () => {
            window.removeEventListener('showSpinner', handleShowSpinner as EventListener);
        };
    }, []);

    return (
        <Backdrop
            open={loading}
            style={{ zIndex: 1300, color: '#fff' }}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default Loader;
