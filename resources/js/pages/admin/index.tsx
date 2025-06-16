import AppLayout from '@/layouts/admin-dashboard';
import React from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Box, Button, TextField, Stack, Typography, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

interface PatientInfo {
    hn: string;
    name: string;
    phone: string;
}

interface UserInfo {
    user_id: string;
    name: string;
}

interface Consent {
    id: number;
    type: string;
    signature_name: string;
    created_at: string;
    consent_1: boolean;
    consent_2: boolean;
    consent_3: boolean;
    consent_4: boolean;
}

const defaultPatient: PatientInfo = {
    hn: '',
    name: '',
    phone: '',
};

export default function Index({
    patient: initialPatient = defaultPatient,
    result1: initialResult1 = '',
    result2: initialResult2 = '',
    result3: initialResult3 = '',
    consents: initialConsents = [],
    witness1,
    witness2,
    informer,
}: {
    patient?: PatientInfo;
    result1?: string;
    result2?: string;
    result3?: string;
    consents?: Consent[];
    witness1?: UserInfo;
    witness2?: UserInfo;
    informer?: UserInfo;
}) {
    const page = usePage();
    const url = page.props.url as string;

    const { data, setData, post, processing, errors } = useForm({ hn: initialPatient.hn || '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`${url}/admin`);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            icon: 'success',
            title: 'Copied!',
            showConfirmButton: false,
            timer: 1500
        });
    };

    const getConsentStatus = (consent: Consent) => {
        if (consent.consent_1) {
            return { label: 'Approved', color: 'success' };
        }
        return { label: 'Rejected', color: 'error' };
    };

    return (
        <AppLayout>
            <Head>
                <title>Search Patient Information</title>
                <meta name="description" content="ค้นหาผู้ป่วย และสร้างข้อกำหนดและการให้ความยินยอมรับบริการ" />
            </Head>
            <Box maxWidth={1200} mx="auto" mt={6} p={3}>
                <Typography variant="h5" mb={3} textAlign="center">Search Patient Information</Typography>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <TextField
                                label="HN"
                                value={data.hn}
                                onChange={(e) => setData('hn', e.target.value)}
                                error={Boolean(errors.hn)}
                                helperText={errors.hn}
                                sx={{ width: '100%' }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                            >
                                Search
                            </Button>
                        </Stack>
                    </form>
                </Paper>

                {initialPatient.hn && (
                    <>
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <Paper sx={{ p: 3, mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Patient Information
                                    </Typography>
                                    <Stack spacing={2}>
                                        <TextField
                                            label="HN"
                                            value={initialPatient.hn}
                                            slotProps={{
                                                input: {
                                                    readOnly: true
                                                }
                                            }}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Name"
                                            value={initialPatient.name}
                                            slotProps={{
                                                input: {
                                                    readOnly: true
                                                }
                                            }}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Phone"
                                            value={initialPatient.phone}
                                            slotProps={{
                                                input: {
                                                    readOnly: true
                                                }
                                            }}
                                            fullWidth
                                        />
                                    </Stack>
                                </Paper>

                            </Grid>
                            <Grid size={6}>
                                <Paper sx={{ p: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Consent Generated Link
                                    </Typography>
                                    <Typography variant="body1" mb={3} >
                                        Informer : {informer?.name} ({informer?.user_id})
                                        <br />
                                        Witness 1 : {witness1?.name} ({witness1?.user_id})
                                        <br />
                                        Witness 2 : {witness2?.name} ({witness2?.user_id})
                                    </Typography>
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Telemedcine Consent"
                                            value={initialResult1}
                                            slotProps={{
                                                htmlInput: {
                                                    readOnly: true
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => handleCopy(initialResult1)} edge="end" disabled={!initialResult1}>
                                                                <ContentCopyIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            fullWidth
                                            multiline
                                            rows={2}
                                        />
                                        <TextField
                                            label="Telehealth Consent"
                                            value={initialResult2}
                                            slotProps={{
                                                htmlInput: {
                                                    readOnly: true
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => handleCopy(initialResult2)} edge="end" disabled={!initialResult2}>
                                                                <ContentCopyIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            fullWidth
                                            multiline
                                            rows={2}
                                        />
                                        <TextField
                                            label="HIV Consent"
                                            value={initialResult3}
                                            slotProps={{
                                                htmlInput: {
                                                    readOnly: true
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => handleCopy(initialResult3)} edge="end" disabled={!initialResult3}>
                                                                <ContentCopyIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            fullWidth
                                            multiline
                                            rows={2}
                                        />
                                    </Stack>
                                </Paper>

                            </Grid>
                        </Grid>
                        {initialConsents.length > 0 && (
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Existing Consents
                                </Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Time</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Signature Name</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {initialConsents.map((consent) => {
                                                const status = getConsentStatus(consent);
                                                return (
                                                    <TableRow key={consent.id} hover>
                                                        <TableCell>
                                                            {format(new Date(consent.created_at), 'dd/MM/yyyy')}
                                                        </TableCell>
                                                        <TableCell>
                                                            {format(new Date(consent.created_at), 'HH:mm:ss')}
                                                        </TableCell>
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
                            </Paper>
                        )}
                    </>
                )}
            </Box>
        </AppLayout>
    );
}