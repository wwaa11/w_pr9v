import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { router, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const page = usePage();
    const url = page.props.url as string;
    const auth = page.props.auth as { user: { name: string, userid: string } };

    function handleMenuPages(link: string) {
        router.visit(`${url}/${link}`);
    }

    return (
        <Box>
            <AppBar position="sticky">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <img
                            src="images/Logo.png"
                            alt="Praram9 Logo"
                            style={{ width: 40, height: 40, marginRight: 16, cursor: 'pointer' }}
                            onClick={() => handleMenuPages('/')}
                        />
                        <Typography className='cursor-pointer' variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Praram9 Hospital
                        </Typography>
                        {auth ? (
                            <>
                                <Typography>Welcome, {auth.user.name}!</Typography>
                                <Button color="inherit" onClick={() => handleMenuPages('/')}>Index</Button>
                                <Button color="inherit" onClick={() => handleMenuPages('telemedicine/eyJpdiI6IkM2RURDSHFFdWpBZW9ES0hHdVJHWlE9PSIsInZhbHVlIjoiQkNlVVVneE50VHNnbzQ3SkZITnprdz09IiwibWFjIjoiOTc1MDJhNWY3ZDQxMWI1ZGMwYTI4NTI5YWVlMzUyNGU2ZjI5ZjJkNzgwMjBhYmRjN2VjZDFhM2JlZGEyMWMzZCIsInRhZyI6IiJ9')}>Telemedcine Consent</Button>
                                <Button
                                    color="inherit"
                                    onClick={() => router.post(`${url}/logout`)}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <span>Guest</span>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth="md">
                <main className="min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </Container>
        </Box>
    );
}