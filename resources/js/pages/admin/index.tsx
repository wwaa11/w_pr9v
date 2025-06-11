import AppLayout from '@/layouts/admin-dashboard';
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Box, Button, TextField, Stack, Typography, IconButton, InputAdornment } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Swal from 'sweetalert2';

interface PatientInfo {
    hn: string;
    name: string;
    address: string;
    phone: string;
}

const defaultPatient: PatientInfo = {
    hn: '',
    name: '',
    address: '',
    phone: '',
};

export default function Index({
    patient: initialPatient = defaultPatient,
    result1: initialResult1 = '',
    result2: initialResult2 = '',
    result3: initialResult3 = ''
}: { patient?: PatientInfo; result1?: string; result2?: string; result3?: string }) {
    const { data, setData, post, processing, errors } = useForm({ hn: initialPatient.hn || '' });
    const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(initialPatient.hn ? initialPatient : null);
    const [response1, setResponse1] = useState(initialResult1);
    const [response2, setResponse2] = useState(initialResult2);
    const [response3, setResponse3] = useState(initialResult3);

    useEffect(() => {
        if (initialPatient && initialPatient.hn) {
            setPatientInfo(initialPatient);
        } else {
            setPatientInfo(null);
        }
        setResponse1(initialResult1);
        setResponse2(initialResult2);
        setResponse3(initialResult3);
    }, [initialPatient, initialResult1, initialResult2, initialResult3]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/search', {
            preserveState: true,
            preserveScroll: true,
            only: ['result1', 'result2', 'result3', 'patient', 'errors'],

            onSuccess: (page: any) => {
                setResponse1(page.props.result1 || '');
                setResponse2(page.props.result2 || '');
                setResponse3(page.props.result3 || '');
                setPatientInfo(page.props.patient && page.props.patient.hn ? page.props.patient : null);

                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'success',
                    title: 'Search complete!',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
            },
            onError: (errors) => {
                console.error("Search errors:", errors);
                Swal.fire({
                    toast: true,
                    position: 'bottom-end',
                    icon: 'error',
                    title: 'Search failed!',
                    text: errors.hn || 'An unknown error occurred.',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            }
        });
    };

    const handleCopy = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Copied!',
            showConfirmButton: false,
            timer: 1200,
            timerProgressBar: true,
        });
    };

    return (
        <AppLayout>
            <Box maxWidth={600} mx="auto" mt={6} p={3}>
                <Typography variant="h5" mb={3} textAlign="center">Search Patient Information</Typography> {/* Added text align */}
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="HN"
                            name="hn"
                            value={data.hn}
                            onChange={e => setData('hn', e.target.value)}
                            error={Boolean(errors.hn)}
                            helperText={errors.hn}
                            fullWidth
                            variant="outlined"
                        />
                        <Button type="submit" variant="contained" disabled={processing}>
                            {processing ? 'Searching...' : 'Search'}
                        </Button>

                        {patientInfo && (
                            <Box mt={2} p={2} border={1} borderColor="divider" borderRadius={1}>
                                <Typography variant="h6" gutterBottom>Patient Details</Typography>
                                <Typography variant="body1">
                                    HN: <Typography component="span" fontWeight="bold">{patientInfo.hn}</Typography>
                                </Typography>
                                <Typography variant="body1">
                                    Patient Name: <Typography component="span" fontWeight="bold">{patientInfo.name}</Typography>
                                </Typography>
                                <Typography variant="body1">
                                    Address: <Typography component="span" fontWeight="bold">{patientInfo.address}</Typography>
                                </Typography>
                                <Typography variant="body1">
                                    Phone: <Typography component="span" fontWeight="bold">{patientInfo.phone}</Typography>
                                </Typography>

                            </Box>
                        )}

                        <TextField
                            label="Telemedcine Consent"
                            value={response1}
                            slotProps={{
                                htmlInput: {
                                    readOnly: true
                                },
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => handleCopy(response1)} edge="end" disabled={!response1}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            fullWidth
                            variant="outlined" // Consistent variant
                        />
                        <TextField
                            label="Telemehealth Consent"
                            value={response2}
                            slotProps={{
                                htmlInput: {
                                    readOnly: true
                                },
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => handleCopy(response2)} edge="end" disabled={!response2}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="HIV Consent"
                            value={response3}
                            slotProps={{
                                htmlInput: {
                                    readOnly: true
                                },
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => handleCopy(response3)} edge="end" disabled={!response3}>
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            fullWidth
                            variant="outlined"
                        />
                    </Stack>
                </form>
            </Box>
        </AppLayout>
    );
}