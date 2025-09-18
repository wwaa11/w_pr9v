import AppLayout from '@/layouts/admin-dashboard';
import React from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Box, Button, TextField, Stack, Typography, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Grid, Card, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

interface PatientInfo {
    hn: string;
    name: string;
    phone: string;
}

interface QueryParams {
    visit_date: string;
    vn: string;
    doctor_name: string;
}

const defaultPatient: PatientInfo = {
    hn: '',
    name: '',
    phone: '',
};

interface UserInfo {
    user_id: string;
    name: string;
}

interface Telemedicine {
    id: number;
    type: string;
    signature_name: string;
    signature_type: string;
    signature_relation: string;
    telemedicine_consent: boolean;
    created_at: string;
}

interface Telehealth {
    id: number;
    type: string;
    name: string;
    name_type: string;
    name_relation: string;
    telehealth_consent: boolean;
    created_at: string;
}

interface Hiv {
    id: number;
    type: string;
    name: string;
    name_type: string;
    name_relation: string;
    hiv_consent: string;
    created_at: string;
    lang: string;
}

interface Sleepness {
    id: number;
    type: string;
    name: string;
    patient_type: string;
    relative_relation: string;
    created_at: string;
}

interface Mind9q {
    id: number;
    language: string;
    type: string;
    created_at: string;
}

export default function Index({
    patient: initialPatient = defaultPatient,
    telemedicine_link: initialTelemedicineLink = '',
    telehealth_link: initialTelehealthLink = '',
    hiv_link: initialHivLink = '',
    sleep_check_link: initialSleepCheckLink = '',
    mind9q_link: initialMind9qLink = '',
    witness1,
    witness2,
    informer,
    queryParams = {
        visit_date: '',
        vn: '',
        doctor_name: '',
    },
    telemedicines = [],
    telehealths = [],
    hivs = [],
    sleepnesses = [],
    mind9qs = [],

}: {
    patient?: PatientInfo;
    telemedicine_link?: string;
    telehealth_link?: string;
    hiv_link?: string;
    sleep_check_link?: string;
    mind9q_link?: string;
    witness1?: UserInfo;
    witness2?: UserInfo;
    informer?: UserInfo;
    queryParams?: QueryParams;
    telemedicines?: Telemedicine[];
    telehealths?: Telehealth[];
    hivs?: Hiv[];
    sleepnesses?: Sleepness[];
    mind9qs?: Mind9q[];
}) {
    const page = usePage();
    const url = page.props.url as string;

    const { data, setData, post, processing, errors } = useForm({ hn: initialPatient.hn || '', language: 'th' });

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

    const setHivStatus = (hiv: Hiv) => {
        if (hiv.hiv_consent == 'self') {
            return { label: 'Approve : Self', color: 'success' };
        } else if (hiv.hiv_consent == 'other') {
            return { label: 'Approve : Other', color: 'warning' };
        } else if (hiv.hiv_consent == 'none') {
            return { label: 'Approve : None', color: 'error' };
        }

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
                    <Stack spacing={2}>
                        <form onSubmit={handleSubmit}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Select
                                    value={data.language}
                                    label="Language"
                                    onChange={(e) => setData('language', e.target.value)}
                                >
                                    <MenuItem value="th">ไทย</MenuItem>
                                    <MenuItem value="en">English</MenuItem>
                                </Select>
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
                    </Stack>
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
                                        Consent Language : <span className='text-red-600 font-bold uppercase'>{data.language}</span>
                                        <br />
                                        ผู้ให้ข้อมูล : {informer?.name} ({informer?.user_id})
                                        <br />
                                        พยานที่ 1 : {witness1?.name} ({witness1?.user_id})
                                        <br />
                                        พยานที่ 2 : {witness2?.name} ({witness2?.user_id})
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
                                        <Card sx={{ p: 2 }}>
                                            <Typography variant="body1" >
                                                <strong>Visit Information</strong>
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid size={5}>
                                                    <Typography variant="body1" >
                                                        <strong>Doctor Name</strong> <br /> {queryParams?.doctor_name || 'ไม่พบข้อมูล'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={5}>
                                                    <Typography variant="body1" >
                                                        <strong>Visit Date</strong> <br /> {queryParams?.visit_date || 'ไม่พบข้อมูล'}
                                                    </Typography>
                                                </Grid>
                                                <Grid size={2}>
                                                    <Typography variant="body1" >
                                                        <strong>Visit VN</strong> <br /> {queryParams?.vn || '-'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Card>
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
                                        <TextField
                                            label="Sleep Check Consent"
                                            value={initialSleepCheckLink}
                                            slotProps={{
                                                htmlInput: {
                                                    readOnly: true
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => handleCopy(initialSleepCheckLink)} edge="end" disabled={!initialSleepCheckLink}>
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
                                            label="Mind9q Consent"
                                            value={initialMind9qLink}
                                            slotProps={{
                                                htmlInput: {
                                                    readOnly: true
                                                },
                                                input: {
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={() => handleCopy(initialMind9qLink)} edge="end" disabled={!initialMind9qLink}>
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
                        <Paper sx={{ p: 3, mb: 3, mt: 3 }}>
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
                                            return (
                                                <TableRow key={telemedicine.id} hover>
                                                    <TableCell>
                                                        {format(new Date(telemedicine.created_at), 'dd/MM/yyyy')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(telemedicine.created_at), 'HH:mm:ss')}
                                                    </TableCell>
                                                    <TableCell>{telemedicine.type}</TableCell>
                                                    <TableCell>{telemedicine.signature_name} {telemedicine.signature_type == 'representative' ? '(' + telemedicine.signature_relation + ')' : ''}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={telemedicine.telemedicine_consent ? 'Approved' : 'Rejected'}
                                                            color={telemedicine.telemedicine_consent ? 'success' : 'error'}
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
                                        {telehealths.map((telehealth) => {
                                            return (
                                                <TableRow key={telehealth.id} hover>
                                                    <TableCell>
                                                        {format(new Date(telehealth.created_at), 'dd/MM/yyyy')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(telehealth.created_at), 'HH:mm:ss')}
                                                    </TableCell>
                                                    <TableCell>{telehealth.type}</TableCell>
                                                    <TableCell>{telehealth.name} {telehealth.name_type == 'representative' ? '(' + telehealth.name_relation + ')' : ''}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={telehealth.telehealth_consent ? 'Approved' : 'Rejected'}
                                                            color={telehealth.telehealth_consent ? 'success' : 'error'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            component={Link}
                                                            href={route('admin.telehealth-consent', telehealth.id)}
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
                                        {hivs.map((hiv) => {
                                            const status = setHivStatus(hiv);
                                            return (
                                                <TableRow key={hiv.id} hover>
                                                    <TableCell>
                                                        {format(new Date(hiv.created_at), 'dd/MM/yyyy')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(hiv.created_at), 'HH:mm:ss')}
                                                    </TableCell>
                                                    <TableCell><span className='text-[10px] px-2 rounded-full uppercase text-white bg-blue-600'>{hiv.lang}</span> {hiv.type}</TableCell>
                                                    <TableCell>{hiv.name} {hiv.name_type == 'representative' ? '(' + hiv.name_relation + ')' : ''}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={status?.label}
                                                            color={status?.color as any}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            component={Link}
                                                            href={route('admin.hiv-consent', hiv.id)}
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
                                        {sleepnesses.map((sleepness) => {
                                            return (
                                                <TableRow key={sleepness.id} hover>
                                                    <TableCell>
                                                        {format(new Date(sleepness.created_at), 'dd/MM/yyyy')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(sleepness.created_at), 'HH:mm:ss')}
                                                    </TableCell>
                                                    <TableCell>{sleepness.type}</TableCell>
                                                    <TableCell>{sleepness.name} {sleepness.patient_type == 'relative' ? '(' + sleepness.relative_relation + ')' : ''}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label="SUCCESS"
                                                            color='success'
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            component={Link}
                                                            href={route('admin.sleepness-consent', sleepness.id)}
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
                                        {mind9qs.map((mind9q) => {
                                            return (
                                                <TableRow key={mind9q.id} hover>
                                                    <TableCell>
                                                        {format(new Date(mind9q.created_at), 'dd/MM/yyyy')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(mind9q.created_at), 'HH:mm:ss')}
                                                    </TableCell>
                                                    <TableCell><span className='text-[10px] px-2 rounded-full uppercase text-white bg-blue-600'>{mind9q.language}</span> {mind9q.type}</TableCell>
                                                    <TableCell></TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label="SUCCESS"
                                                            color='success'
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            component={Link}
                                                            href={route('admin.mind9q-consent', mind9q.id)}
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
                    </>
                )}
            </Box>
        </AppLayout>
    );
}