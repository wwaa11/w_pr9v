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
    TablePagination,
    Stack,
    Button,
    Link,
    TableSortLabel,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, startOfDay, endOfDay } from 'date-fns';
import { router } from '@inertiajs/react';

interface Consent {
    id: number;
    pdf_id: number;
    created_at: string;
    hn: string;
    patient_name: string;
    type: string;
    signature_type: string;
    signature_name: string;
    signature_relation: string;
    telemedicine_consent: boolean;
    name_type: string;
    name_relation: string;
    telehealth_consent: boolean;
    hiv_consent: string;
    patient_type: string;
    name: string;
    relative_relation: string;
}

type Order = 'asc' | 'desc';

interface HeadCell {
    id: keyof Consent;
    label: string;
    numeric: boolean;
}

interface TypeSelect {
    label: string;
    value: string;
}

const headCells: HeadCell[] = [
    { id: 'created_at', label: 'Date & Time', numeric: false },
    { id: 'hn', label: 'HN', numeric: false },
    { id: 'type', label: 'Type', numeric: false },
    { id: 'signature_name', label: 'Signature Name', numeric: false },
];

export default function View() {
    const pageProps = usePage();
    const url = pageProps.props.url as string;
    const consents = pageProps.props.consents as Consent[];
    const type_select = pageProps.props.type_select as TypeSelect[];
    const page = pageProps.props.page as string;
    const [currentPage, setCurrentPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [startDate, setStartDate] = React.useState<Date | null>(startOfDay(new Date()));
    const [endDate, setEndDate] = React.useState<Date | null>(endOfDay(new Date()));
    const [order, setOrder] = React.useState<Order>('desc');
    const [orderBy, setOrderBy] = React.useState<keyof Consent>('created_at');
    const [hnFilter, setHnFilter] = React.useState('');
    const [typeFilter, setTypeFilter] = React.useState('');

    const getConsentStatus = (consent: Consent) => {
        if (consent.type == 'Telemedicine' && consent.telemedicine_consent == true) {
            return { label: 'Approved', color: 'success' };
        } else if (consent.type == 'Telehealth' && consent.telehealth_consent == true) {
            return { label: 'Approved', color: 'success' };
        } else if (consent.type == 'HIV') {
            if (consent.hiv_consent == 'self') {
                return { label: 'Approved : Self', color: 'success' };
            } else if (consent.hiv_consent == 'other') {
                return { label: 'Approved : Other', color: 'success' };
            } else if (consent.hiv_consent == 'none') {
                return { label: 'Approved : None', color: 'success' };
            }
        } else if (consent.type == 'Sleep Check') {
            return { label: 'SUCCESS', color: 'success' };
        }

        return { label: 'Rejected', color: 'error' };
    };

    const getConsentName = (consent: Consent) => {
        if (consent.type == 'Telemedicine') {
            if (consent.signature_type == 'patient') {
                return consent.signature_name;
            } else {
                return consent.signature_name + ' (' + consent.signature_relation + ')';
            }
        } else if (consent.type == 'Telehealth' || consent.type == 'HIV') {
            if (consent.name_type == 'patient') {
                return consent.name;
            } else {
                return consent.name + ' (' + consent.name_relation + ')';
            }
        } else if (consent.type == 'Sleep Check') {
            if (consent.patient_type == 'patient') {
                return consent.name;
            } else {
                return consent.name + ' (' + consent.relative_relation + ')';
            }
        }
    };

    const getConsentLink = (consent: Consent) => {
        if (consent.type == 'Telemedicine') {
            return url + '/admin/telemedicine-consent/' + consent.pdf_id;
        } else if (consent.type == 'Telehealth') {
            return url + '/admin/telehealth-consent/' + consent.pdf_id;
        } else if (consent.type == 'HIV') {
            return url + '/admin/hiv-consent/' + consent.pdf_id;
        } else if (consent.type == 'Sleep Check') {
            return url + '/admin/sleepness-consent/' + consent.pdf_id;
        }
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
            router.get(url + '/admin/' + page, {
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
                hn: hnFilter.trim(),
                type: typeFilter,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleClearFilters = () => {
        setHnFilter('');
        setTypeFilter('');
        setStartDate(startOfDay(new Date()));
        setEndDate(endOfDay(new Date()));
        router.get(url + '/admin/' + page, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleHnFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHnFilter(event.target.value);
    };

    const handleHnFilterKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleDateRangeChange();
        }
    };

    const handleTypeFilterChange = (event: any) => {
        setTypeFilter(event.target.value);
    };

    const handleRequestSort = (_event: React.MouseEvent<unknown>, property: keyof Consent) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedConsents = React.useMemo(() => {
        return [...consents].sort((a, b) => {
            // Primary sort by the selected column
            let comparison = 0;
            if (orderBy === 'created_at') {
                comparison = order === 'asc'
                    ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            } else {
                comparison = order === 'asc'
                    ? String(a[orderBy]).localeCompare(String(b[orderBy]))
                    : String(b[orderBy]).localeCompare(String(a[orderBy]));
            }

            // If values are equal, use ID as secondary sort
            if (comparison === 0) {
                return order === 'asc' ? a.id - b.id : b.id - a.id;
            }

            return comparison;
        });
    }, [consents, order, orderBy]);

    return (
        <AdminDashboard>
            <Head>
                <title>Search Consent Information</title>
                <meta name="description" content="รายการข้อกำหนดและการให้ความยินยอมรับบริการ" />
            </Head>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Documents
                </Typography>
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            label="HN"
                            value={hnFilter}
                            onChange={handleHnFilterChange}
                            onKeyUp={handleHnFilterKeyPress}
                            size="small"
                            placeholder="Enter HN number"
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={typeFilter}
                                label="Type"
                                onChange={handleTypeFilterChange}
                            >
                                {type_select.map((item, index) => (
                                    <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                        <Button
                            variant="outlined"
                            onClick={handleClearFilters}
                        >
                            Clear Filters
                        </Button>
                    </Stack>
                </Paper>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    {headCells.map((headCell) => (
                                        <TableCell
                                            key={headCell.id}
                                            align={headCell.numeric ? 'right' : 'left'}
                                            sortDirection={orderBy === headCell.id ? order : false}
                                        >
                                            <TableSortLabel
                                                active={orderBy === headCell.id}
                                                direction={orderBy === headCell.id ? order : 'asc'}
                                                onClick={(event) => handleRequestSort(event, headCell.id)}
                                            >
                                                {headCell.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedConsents
                                    .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                                    .map((consent) => {
                                        const status = getConsentStatus(consent);
                                        const name = getConsentName(consent);
                                        return (
                                            <TableRow key={consent.id} hover>
                                                <TableCell>{consent.id}</TableCell>
                                                <TableCell>
                                                    {format(new Date(consent.created_at), 'd/M/Y HH:mm:ss')}
                                                </TableCell>
                                                <TableCell>{consent.hn}</TableCell>
                                                <TableCell>{consent.type}</TableCell>
                                                <TableCell>{name}</TableCell>
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
                                                        href={getConsentLink(consent)}
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
