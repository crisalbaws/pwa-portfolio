import React, { useEffect, useState } from 'react';
import { getTickets } from '../fetch';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Chip, Avatar, Box,
    Button,
    TablePagination,
    IconButton
} from '@mui/material';
import SnackBar from './snackbar';
import { useNavigate } from 'react-router-dom';
import QrCode from '@mui/icons-material/QrCode';
import QrScannerHtml5 from './QRScanner';

const TicketList = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<any[]>([]);
    const [snackBar, setSnack] = useState<any>({ open: false, message: '', type: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [showScanner, setShowScanner] = useState(false);
    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        const response: any = await getTickets('ticket/all', 'APIREST');
        if (response.statusCode == 200) {
            setTickets(response.data);
        }
        setSnack({
            open: true,
            message: response.statusCode == 200 ? response.message : 'Error',
            type: response.statusCode == 200 ? 'success' : 'error',
            duration: 3000
        });
    }

    const renderStatus = (status: any) => {
        const color = status === "Closed" ? "success" : "warning";
        return <Chip label={status} color={color} />;
    };
    const styles = {
        backgroundColor: '#143437',
        display: 'flex',
        flexDirection: 'column',
        fontSize: 'calc(10px + 2vmin)',
        color: 'white',
        padding: '20px',
        height: 'calc(100vh - 40px)'
    };

    const handleLogout = () => {
        localStorage.removeItem('PWA:Portfolio:dataUser');
        localStorage.removeItem('PWA:Portfolio:dateSesion');
        navigate('/login');
    }


    const handleChangePage = (event: any, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedTickets = tickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleToggleScanner = () => {
        setShowScanner((prevShowScanner) => !prevShowScanner);
    }

    const handleScann = async (data: string) => {
        setShowScanner(false);
        console.log(data);
        setSnack({
            open: true,
            message: data,
            type: 'success',
            duration: 3000
        });
    }
    const onCancel = async () => {
        setShowScanner(false);
    }
    return (
        <Box sx={{ styles }}>
            {showScanner ? (
                <QrScannerHtml5 onScan={handleScann} onCancel={onCancel} />
            ) : (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Ticket List
                        </Typography>
                        <Box>
                            <IconButton color="inherit" onClick={handleToggleScanner}>
                                <QrCode />
                            </IconButton>
                            <Button
                                onClick={handleLogout}
                                sx={{ marginLeft: '10px', background: '#c12a2a', height: '30px' }}
                                variant="contained"
                            >
                                Cerrar Sesión
                            </Button>
                        </Box>
                    </Box>

                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: '0px 0px 8px 6px #ffffff52',
                            width: 'calc(100vw - 20px)',
                            overflow: 'auto',
                            height: '70vh',
                            marginBottom: '20px'
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Folio</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Created By</TableCell>
                                    <TableCell>Creation Date</TableCell>
                                    <TableCell>Price</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedTickets.map((ticket) => (
                                    <TableRow key={ticket.id}>
                                        <TableCell>
                                            <Typography variant="body2">{ticket.folio}</Typography>
                                        </TableCell>
                                        <TableCell>{renderStatus(ticket.status)}</TableCell>
                                        <TableCell>{ticket.ticketType}</TableCell>
                                        <TableCell>{ticket.category}</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center">
                                                <Avatar alt={ticket.userCreationName} sx={{ mr: 1 }} />
                                                {ticket.userCreationName}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{new Date(ticket.creationDate).toLocaleDateString()}</TableCell>
                                        <TableCell>${ticket.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            component="div"
                            count={tickets.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25]}
                            labelRowsPerPage="Rows per page"
                            sx={{
                                backgroundColor: '#fff',
                                display: 'flex',
                                justifyContent: 'flex-start',
                                paddingLeft: '16px'
                            }}
                        />
                    </TableContainer>
                </>
            )}
            <SnackBar
                onClose={() => setSnack({ open: false, message: '', type: '' })}
                open={snackBar.open}
                message={snackBar.message}
                duration={snackBar.duration}
                type={snackBar.type} />
        </Box>
    );

}
export default TicketList;
