import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useForm, usePage } from '@inertiajs/react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';

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
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
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

export default function Login() {
    const page = usePage();
    const url = page.props.url as string;
    const { errors } = usePage().props as { errors: Record<string, string> };
    const [showPassword, setShowPassword] = React.useState(false);

    const { data, setData, post, processing } = useForm({
        userid: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.target.name as "userid" | "password", e.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(`${url}/login`);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <SignInContainer direction="column" justifyContent="center">
            <Card variant="outlined">
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <img
                        src="images/Side Logo.png"
                        alt="Logo"
                        style={{ cursor: 'pointer' }}
                        className='aspect-auto w-48 mx-auto'
                    />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            mt: 2,
                            fontWeight: 600,
                            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                            color: 'text.primary'
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ mt: 1, color: 'text.secondary' }}
                    >
                        Please sign in to continue
                    </Typography>
                </Box>

                {errors.login && (
                    <Fade in={Boolean(errors.login)}>
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errors.login}
                        </Alert>
                    </Fade>
                )}

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="userid" sx={{ mb: 1, fontWeight: 500 }}>
                            Employee ID
                        </FormLabel>
                        <TextField
                            id="userid"
                            type="text"
                            name="userid"
                            placeholder="รหัสพนักงาน"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                            value={data.userid}
                            onChange={handleChange}
                            error={Boolean(errors.userid)}
                            helperText={errors.userid}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="password" sx={{ mb: 1, fontWeight: 500 }}>
                            Password
                        </FormLabel>
                        <TextField
                            name="password"
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                }
                            }}
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={processing}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}
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
    );
}