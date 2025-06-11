import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { router, usePage } from '@inertiajs/react';



export default function AppLayout({ children }: { children: React.ReactNode }) {
    const page = usePage();
    const url = page.props.url as string;
    const auth = page.props.auth as { user: { name: string, userid: string } };

    return (
        <Box>
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