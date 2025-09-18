import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function AppLayout({ children }: { children: React.ReactNode }) {

    return (
        <div>
            <Box>
                <Container maxWidth="lg">
                    <main className="min-h-screen mx-auto">
                        {children}
                    </main>
                </Container>
            </Box>
        </div>
    );
}