import React from 'react';
import { Head } from '@inertiajs/react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    CardActions,
} from '@mui/material';
import AppLayout from "@/layouts/patient";

interface WelcomeProps {
    auth: {
        user: {
            name: string;
        };
    };
}

export default function Welcome({ auth }: WelcomeProps) {
    return (
        <AppLayout>
            <Head title="Welcome" />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Welcome Header */}
                <Paper sx={{ p: 4, mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        Welcome to PR9 Consent Forms
                    </Typography>
                    <Typography variant="h5" color="text.secondary" paragraph>
                        {auth.user ? `Hello, ${auth.user.name}` : 'Please sign in to continue'}
                    </Typography>
                </Paper>
            </Container>
        </AppLayout>
    );
}
