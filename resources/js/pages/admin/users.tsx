import { Head, router, usePage } from '@inertiajs/react';
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Box,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import AdminDashboard from '@/layouts/admin-dashboard';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

interface User {
    id: number;
    user_id: string;
    name: string;
    role: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

type Order = 'asc' | 'desc';

export default function Users({ users }: Props) {
    const pageProps = usePage();
    const url = pageProps.props.url as string;
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('name');
    const [currentPage, setCurrentPage] = useState(users.current_page - 1);
    const [rowsPerPage, setRowsPerPage] = useState(users.per_page);
    const [openDialog, setOpenDialog] = useState(false);
    const [newUserId, setNewUserId] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSetWitness = (userId: number) => {
        router.post(`${url}/admin/users/${userId}/set-witness`);
    };

    const handleSetUser = (userId: number) => {
        router.post(`${url}/admin/users/${userId}/set-user`);
    };

    const handleRequestSort = (property: keyof User) => {
        const isAsc = orderBy === property && order === 'asc';
        const newOrder = isAsc ? 'desc' : 'asc';
        setOrder(newOrder);
        setOrderBy(property);

        router.get(`${url}/admin/users`, {
            sort_field: property,
            sort_direction: newOrder,
            page: currentPage + 1,
            per_page: rowsPerPage
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setCurrentPage(newPage);
        router.get(`${url}/admin/users`, {
            page: newPage + 1,
            per_page: rowsPerPage,
            sort_field: orderBy,
            sort_direction: order
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(0);
        router.get(`${url}/admin/users`, {
            page: 1,
            per_page: newRowsPerPage,
            sort_field: orderBy,
            sort_direction: order
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAddWitness = () => {
        setError('');
        setIsSubmitting(true);

        router.post(`${url}/admin/users/add-witness`, {
            userid: newUserId
        }, {
            onSuccess: () => {
                setOpenDialog(false);
                setNewUserId('');
                setSnackbar({
                    open: true,
                    message: 'User added successfully as witness',
                    severity: 'success'
                });
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewUserId('');
        setError('');
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <AdminDashboard>
            <Head title="Manage Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" component="h2">
                                    Manage Users
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenDialog(true)}
                                >
                                    Add Witness
                                </Button>
                            </Box>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'user_id'}
                                                    direction={orderBy === 'user_id' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('user_id')}
                                                >
                                                    User ID
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'name'}
                                                    direction={orderBy === 'name' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('name')}
                                                >
                                                    Name
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'role'}
                                                    direction={orderBy === 'role' ? order : 'asc'}
                                                    onClick={() => handleRequestSort('role')}
                                                >
                                                    Role
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.user_id}</TableCell>
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.role}</TableCell>
                                                <TableCell>
                                                    {user.role !== 'witness' && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() => handleSetWitness(user.id)}
                                                        >
                                                            Set as Witness
                                                        </Button>
                                                    )}
                                                    {user.role === 'witness' && (
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={() => { handleSetUser(user.id); }}
                                                        >
                                                            Change to User
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={users.total}
                                    rowsPerPage={rowsPerPage}
                                    page={currentPage}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Add New Witness</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="User ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newUserId}
                        onChange={(e) => {
                            setNewUserId(e.target.value);
                            setError('');
                        }}
                        error={Boolean(error)}
                        helperText={error}
                        disabled={isSubmitting}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseDialog}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddWitness}
                        variant="contained"
                        disabled={isSubmitting || !newUserId.trim()}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Adding...' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </AdminDashboard>
    );
} 