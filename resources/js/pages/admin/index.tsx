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

interface Telemedicine {
    id: number;
    type: string;
    signature_type: string;
    signature_name: string;
    telemedicine_consent: boolean;
    created_at: string;
}

const defaultPatient: PatientInfo = {
    hn: '',
    name: '',
    phone: '',
};

export default function Index({
    patient: initialPatient = defaultPatient,
    telemedicine_link: initialTelemedicineLink = '',
    telehealth_link: initialTelehealthLink = '',
    hiv_link: initialHivLink = '',
    telemedicines = [],
    witness1,
    witness2,
    informer,
}: {
    patient?: PatientInfo;
    telemedicine_link?: string;
    telehealth_link?: string;
    hiv_link?: string;
    witness1?: UserInfo;
    witness2?: UserInfo;
    informer?: UserInfo;
    telemedicines?: Telemedicine[];
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

    const getTelemedicineStatus = (telemedicine: Telemedicine) => {
        if (telemedicine.telemedicine_consent) {
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
                                            value={initialTelemedicineLink}
                                            slotProps={{
                                                htmlInput: {
                                                    readOnly: true
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => handleCopy(initialTelemedicineLink)} edge="end" disabled={!initialTelemedicineLink}>
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
                                            value={initialTelehealthLink}
                                            slotProps={{
                                                htmlInput: {
                                                    readOnly: true
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => handleCopy(initialTelehealthLink)} edge="end" disabled={!initialTelehealthLink}>
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
                                            value={initialHivLink}
                                            slotProps={{
                                                htmlInput: {
                                                    readOnly: true
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => handleCopy(initialHivLink)} edge="end" disabled={!initialHivLink}>
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
                        {telemedicines.length > 0 && (
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
                                            {telemedicines.map((telemedicine) => {
                                                const status = getTelemedicineStatus(telemedicine);
                                                return (
                                                    <TableRow key={telemedicine.id} hover>
                                                        <TableCell>
                                                            {format(new Date(telemedicine.created_at), 'dd/MM/yyyy')}
                                                        </TableCell>
                                                        <TableCell>
                                                            {format(new Date(telemedicine.created_at), 'HH:mm:ss')}
                                                        </TableCell>
                                                        <TableCell>{telemedicine.type}</TableCell>
                                                        <TableCell>{telemedicine.signature_name}</TableCell>
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
                                                                href={route('admin.telemedicine-consent', telemedicine.id)}
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