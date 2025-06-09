import Container from "@mui/material/Container";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <Container maxWidth="md">
            <main className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </Container>
    );
}