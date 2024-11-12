import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { loginRequest } from '../fetch';
import SnackBar from './../components/snackbar'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LoginRequest, LoginResponse } from '../interfaces/interfaces.app';
import AlertComponent from './Alert';

const useStyles = makeStyles((theme: any) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    paper: {
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80%',
        maxWidth: 400,
        height: 450,
    },
    button: {
        marginTop: theme.spacing(4),
        width: '100%',
    },
    passwordField: {
        marginBottom: theme.spacing(4),
        width: '100%',
    },
    logo: {
        width: '100px',
        marginBottom: theme.spacing(2),
        borderRadius: '100%',
    },
    title: {
        marginBottom: theme.spacing(3),
    },
    customTextField: {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#CCCCCC',
            },
            '&:hover fieldset': {
                borderColor: '#418091',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#418091',
            },
        },
        '& .MuiInputLabel-root': {
            color: '#CCCCCC',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#418091',
        },
    },
}));

export const Login: React.FC = () => {


    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [snackBar, setSnack] = useState<any>({ open: false, message: '', type: '' });
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    useEffect(() => {
        handleOpen();
    }, []);

    useEffect(() => {
        const dataUser = localStorage.getItem('PWA:Portfolio:dataUser');
        const dateSesion = localStorage.getItem('PWA:Portfolio:dateSesion');
        if (dataUser && dateSesion) {
            const today = moment(new Date()).format('YYYY-MM-DD');
            if (dateSesion === today) {
                navigate('/tickets');
            }
        }
    }, [navigate]);

    const login = async (event: React.FormEvent<HTMLFormElement>) => {

        try {
            const request: LoginRequest = {
                email: username,
                password: password,
            }
            const response: LoginResponse = await loginRequest('auth/login', 'APIPASS', request);

            if (response.statusCode == 200) {
                console.log('Login successful:', response);
                setSnack({
                    open: true,
                    message: response.message ? response.message : 'Correcto',
                    type: response.statusCode == 200 ? 'success' : 'error',
                    duration: 3000
                });
                localStorage.setItem('PWA:Portfolio:dataUser', JSON.stringify(response));
                localStorage.setItem('PWA:Portfolio:dateSesion', moment(new Date()).format('YYYY-MM-DD'));
                navigate('/tickets');
            } else {
                console.error('Login failed:', response.message);
                setSnack({
                    open: true,
                    message: response.message ? response.message : 'Error',
                    type: response.statusCode == 200 ? 'success' : 'error',
                    duration: 3000
                });
            }
        } catch (error) {
            setSnack({
                open: true,
                message: 'Error de server',
                type: 'error',
                duration: 3000
            });
            console.error('Request failed:', error);
        }
    };




    return (
        <Container className={classes.container}>
            <Paper className={classes.paper}>
                <img src="/PWA-Portfolio/logo192.png" alt="Logo" className={classes.logo} />
                <Typography variant="h5" className={classes.title}>
                    PWA Portafolio
                </Typography>
                <form onSubmit={login}>
                    <TextField
                        label="Usuario"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        className={classes.customTextField}
                        onChange={(e: any) => setUsername(e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e: any) => setPassword(e.target.value)}
                        className={classes.customTextField}
                        style={{ marginBottom: '32px' }}
                    />
                    <Button
                        sx={{ background: '#418091' }}
                        type="submit"
                        variant="contained"
                        className={classes.button}
                        fullWidth
                        style={{ marginTop: '32px' }}>
                        Iniciar Sesión
                    </Button>
                </form>
            </Paper>
            <SnackBar
                onClose={() => setSnack({ open: false, message: '', type: '' })}
                open={snackBar.open}
                message={snackBar.message}
                duration={snackBar.duration}
                type={snackBar.type} />
            <AlertComponent open={open} onClose={handleClose} />
        </Container>
    );
}

export default Login;
