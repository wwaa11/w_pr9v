import React, { useState, useMemo } from "react";
import { router, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
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
    TextField,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Types
interface Consent {
    id: number;
    hn: string;
    type: string;
    fulldate: string;
    telemedicine_consent?: boolean;
    treatment_consent?: boolean;
    insurance_consent?: boolean;
    marketing_consent?: boolean;
    hiv_consent?: boolean;
    signature_name?: string;
    signature_type?: string;
    signature_relation?: string;
    name?: string;
    name_type?: string;
    name_relation?: string;
}

interface User {
    id: number;
    user_id: string;
    name: string;
}

interface UserHeaderProps {
    user: User | null;
    onLogout: () => void;
}

interface ConsentFilterProps {
    hn: string;
    setHn: (hn: string) => void;
    onFilter: (e: React.FormEvent) => void;
    onClear: () => void;
}

interface ConsentTableProps {
    consents: Consent[];
}

interface Props {
    consents: Consent[];
    auth: {
        user: User | null;
    };
}

// Subcomponents
const UserHeader: React.FC<UserHeaderProps> = ({ user, onLogout }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2 w-full">
        {user && (
            <div className="flex items-center gap-3 text-gray-700 text-base">
                {/* Avatar can be added back here if desired */}
                <div>
                    <span className="font-semibold">{user.name}</span>
                    <div className="text-xs text-gray-500">รหัสพนักงาน: {user.user_id}</div>
                </div>
            </div>
        )}
        <button
            onClick={onLogout}
            type="button"
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-2 rounded font-bold shadow focus:ring-2 focus:ring-red-400 transition-colors"
            aria-label="Logout"
        >
            Logout
        </button>
    </div>
);

const ConsentFilter: React.FC<ConsentFilterProps> = ({ hn, setHn, onFilter, onClear }) => (
    <form onSubmit={onFilter} className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4 mb-8 items-end">
        <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">HN</label>
            <input
                type="text"
                name="hn"
                value={hn}
                onChange={e => setHn(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Hospital Number"
                aria-label="Hospital Number"
            />
        </div>
        <div className="flex gap-2">
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-white px-5 py-2 rounded font-semibold transition-colors"
                aria-label="Filter"
            >
                Filter
            </button>
            <button
                type="button"
                onClick={onClear}
                className="bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:ring-blue-400 text-gray-700 px-4 py-2 rounded font-semibold transition-colors"
                aria-label="Clear filter"
            >
                Clear
            </button>
        </div>
    </form>
);

const getConsentStatus = (consent: Consent) => {
    if (consent.type === 'Telemedicine') {
        if (
            consent.telemedicine_consent &&
            consent.treatment_consent &&
            consent.insurance_consent &&
            consent.marketing_consent
        ) {
            return { label: 'ยินยอม', color: 'success', icon: <CheckCircleIcon fontSize="small" /> };
        } else {
            return { label: 'ไม่ยินยอม', color: 'error', icon: <CancelIcon fontSize="small" /> };
        }
    } else if (consent.type === 'Telehealth') {
        return { label: 'ยินยอม', color: 'success', icon: <CheckCircleIcon fontSize="small" /> };
    } else if (consent.type === 'HIV') {
        return consent.hiv_consent
            ? { label: 'ยินยอม', color: 'success', icon: <CheckCircleIcon fontSize="small" /> }
            : { label: 'ไม่ยินยอม', color: 'error', icon: <CancelIcon fontSize="small" /> };
    }
    return { label: '-', color: 'default', icon: null };
};

const getConsentSigner = (consent: Consent) => {
    if (consent.type === 'Telemedicine') {
        if (consent.signature_type === 'patient') {
            return consent.signature_name;
        } else {
            return consent.signature_name + (consent.signature_relation ? ` (${consent.signature_relation})` : '');
        }
    } else if (consent.type === 'Telehealth' || consent.type === 'HIV') {
        if (consent.name_type === 'patient') {
            return consent.name;
        } else {
            return consent.name + (consent.name_relation ? ` (${consent.name_relation})` : '');
        }
    }
    return '-';
};

const ConsentTable: React.FC<{ consents: Consent[] }> = ({ consents }) => {
    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const pagedConsents = useMemo(() =>
        consents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [consents, page, rowsPerPage]
    );

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>HN</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Consent Date</TableCell>
                            <TableCell>ผลการให้ความยินยอม</TableCell>
                            <TableCell>ผู้ลงนาม</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagedConsents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                                    No consent records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedConsents.map((consent) => (
                                <TableRow key={consent.id} hover>
                                    <TableCell>{consent.id}</TableCell>
                                    <TableCell>{consent.hn}</TableCell>
                                    <TableCell>{consent.type}</TableCell>
                                    <TableCell>{consent.fulldate}</TableCell>
                                    <TableCell>
                                        {consent.type === 'Telemedicine' ? (
                                            <Stack direction="row" spacing={0.5}>
                                                <Chip label={`Telemedicine: ${consent.telemedicine_consent ? 'ยินยอม' : 'ไม่ยินยอม'}`} color={consent.telemedicine_consent ? 'success' : 'error'} size="small" icon={consent.telemedicine_consent ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />} />
                                                <Chip label={`รักษา: ${consent.treatment_consent ? 'ยินยอม' : 'ไม่ยินยอม'}`} color={consent.treatment_consent ? 'success' : 'error'} size="small" icon={consent.treatment_consent ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />} />
                                                <Chip label={`ประกัน: ${consent.insurance_consent ? 'ยินยอม' : 'ไม่ยินยอม'}`} color={consent.insurance_consent ? 'success' : 'error'} size="small" icon={consent.insurance_consent ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />} />
                                                <Chip label={`การตลาด: ${consent.marketing_consent ? 'ยินยอม' : 'ไม่ยินยอม'}`} color={consent.marketing_consent ? 'success' : 'error'} size="small" icon={consent.marketing_consent ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />} />
                                            </Stack>
                                        ) : consent.type === 'Telehealth' ? (
                                            <Chip label="ยินยอม" color="success" size="small" icon={<CheckCircleIcon fontSize="small" />} />
                                        ) : consent.type === 'HIV' ? (
                                            <Chip label={consent.hiv_consent ? 'ยินยอม' : 'ไม่ยินยอม'} color={consent.hiv_consent ? 'success' : 'error'} size="small" icon={consent.hiv_consent ? <CheckCircleIcon fontSize="small" /> : <CancelIcon fontSize="small" />} />
                                        ) : (
                                            <Chip label="-" size="small" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight={600} component="span">
                                            {getConsentSigner(consent)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={consents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

// Main Page Component
const UserConsents: React.FC<Props> = ({ consents, auth }) => {
    const [hn, setHn] = useState("");
    const page = usePage();
    const url = page.props.url as string;

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route("user.index"), { hn }, { preserveState: true });
    };

    const handleClear = () => {
        setHn("");
        router.get(route("user.index"), {}, { preserveState: true });
    };

    const handleLogout = () => {
        router.post(route('logout.user'));
    };

    return (
        <Box sx={{ p: 3 }}>
            <Head title="Consent Records" />
            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                            {auth.user?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            รหัสพนักงาน: {auth.user?.user_id}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleLogout}
                        sx={{ fontWeight: 700 }}
                    >
                        Logout
                    </Button>
                </Stack>
            </Paper>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Box component="img" src={url + "/images/Logo.png"} alt="Logo" sx={{ height: 48, width: 48 }} />
                <Typography variant="h4" fontWeight={800} color="primary.main">
                    Consent Records
                </Typography>
            </Stack>
            <Paper sx={{ p: 2, mb: 3 }}>
                <form onSubmit={handleFilter}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="end">
                        <TextField
                            label="HN"
                            value={hn}
                            onChange={e => setHn(e.target.value)}
                            size="small"
                            placeholder="Hospital Number"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ minWidth: 120 }}
                        >
                            Filter
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            onClick={handleClear}
                            sx={{ minWidth: 120 }}
                        >
                            Clear
                        </Button>
                    </Stack>
                </form>
            </Paper>
            <ConsentTable consents={consents} />
        </Box>
    );
};

const Page = (props: Props) => (
    <Box>
        <UserConsents consents={props.consents} auth={props.auth} />
    </Box>
);

export default Page;
