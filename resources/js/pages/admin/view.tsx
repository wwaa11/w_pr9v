import * as React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminDashboard from '@/layouts/admin-dashboard';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    TablePagination,
    Stack,
    Button,
    Link,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format, startOfDay, endOfDay } from 'date-fns';
import { router } from '@inertiajs/react';

interface Consent {
    id: number;
    hn: string;
    type: string;
    signature_name: string;
    created_at: string;
    consent_1: boolean;
    consent_2: boolean;
    consent_3: boolean;
    consent_4: boolean;
}

export default function View() {
    const pageProps = usePage();
    const url = pageProps.props.url as string;
    const consents = pageProps.props.consents as Consent[];
    const [currentPage, setCurrentPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [startDate, setStartDate] = React.useState<Date | null>(startOfDay(new Date()));
    const [endDate, setEndDate] = React.useState<Date | null>(endOfDay(new Date()));

    const getConsentStatus = (consent: Consent) => {
        const allConsents = [consent.consent_1, consent.consent_2, consent.consent_3, consent.consent_4];
        const approvedCount = allConsents.filter(Boolean).length;

        if (approvedCount === 4) return { label: 'Approved', color: 'success' };
        if (approvedCount === 0) return { label: 'Rejected', color: 'error' };
        return { label: 'Partial', color: 'warning' };
    };

    const handleViewConsent = (id: number) => {
        console.log('View consent:', id);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const handleDateRangeChange = () => {
        if (startDate && endDate) {
            router.get(url + '/admin/view', {
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminDashboard>
            <Head>
                <title>Search Consent Information</title>
                <meta name="description" content="รายการข้อกำหนดและการให้ความยินยอมรับบริการ" />
            </Head>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Consents
                </Typography>
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </LocalizationProvider>
                        <Button
                            variant="contained"
                            onClick={handleDateRangeChange}
                            disabled={!startDate || !endDate}
                        >
                            Apply Filter
                        </Button>
                    </Stack>
                </Paper>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Time</TableCell>
                                    <TableCell>HN</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Signature Name</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {consents
                                    .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                                    .map((consent) => {
                                        const status = getConsentStatus(consent);
                                        return (
                                            <TableRow key={consent.id} hover>
                                                <TableCell>
                                                    {format(new Date(consent.created_at), 'HH:mm:ss')}
                                                </TableCell>
                                                <TableCell>{consent.hn}</TableCell>
                                                <TableCell>{consent.type}</TableCell>
                                                <TableCell>{consent.signature_name}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={status.label}
                                                        color={status.color as any}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        component={Link}
                                                        href={route('admin.telemedicine-consent', consent.id)}
                                                        variant="contained"
                                                        size="small"
                                                        color="primary"
                                                    >
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={consents.length}
                        rowsPerPage={rowsPerPage}
                        page={currentPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Box>
        </AdminDashboard>
    );
}
