import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Box,
    Typography,
    Button,
    Card as MuiCard,
    TextField,
    Stack,
    InputAdornment,
    IconButton,
    CircularProgress,
    Alert,
    Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AppLayout from "@/layouts/patient";

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

interface WelcomeProps {
    auth: {
        user: {
            name: string;
        };
    };
}

export default function Welcome({ auth }: WelcomeProps) {
    const { data, setData, post, processing, errors } = useForm({
        userid: '',
        password: '',
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const [submitError, setSubmitError] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.target.name as 'userid' | 'password', e.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError('');
        post(route('login.user'), {
            onError: (err) => {
                setSubmitError(err.login || 'Login failed');
            },
        });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <AppLayout>
            <Head title="Welcome" />
            <SignInContainer direction="column" justifyContent="center">
                <Card variant="outlined">
                    <Typography variant="h3" textAlign={'center'} component="h1" gutterBottom>
                        PR9 Consent Forms
                    </Typography>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <img
                            src="images/Side Logo.png"
                            alt="Logo"
                            style={{ cursor: 'pointer' }}
                            className='aspect-auto w-48 mx-auto'
                        />
                        <Typography
                            component="h1"
                            variant="h2"
                            sx={{ mt: 2, fontWeight: 600, fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: 'text.primary' }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
                            Please sign in to continue
                        </Typography>
                    </Box>
                    {submitError && (
                        <Fade in={Boolean(submitError)}>
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {submitError}
                            </Alert>
                        </Fade>
                    )}
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
                    >
                        <TextField
                            id="userid"
                            type="text"
                            name="userid"
                            label="รหัสพนักงาน"
                            placeholder="รหัสพนักงาน"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            value={data.userid}
                            onChange={handleChange}
                            error={Boolean(errors.userid)}
                            helperText={errors.userid}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            placeholder="••••••"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            required
                            fullWidth
                            variant="outlined"
                            value={data.password}
                            onChange={handleChange}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={processing}
                            sx={{ mt: 2, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}
                        >
                            {processing ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </Box>
                </Card>
            </SignInContainer>
        </AppLayout>
    );
}
