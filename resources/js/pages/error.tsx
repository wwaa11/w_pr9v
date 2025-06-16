import AppLayout from "@/layouts/patient";
import { usePage, Link } from "@inertiajs/react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

interface ErrorProps {
    status: number;
    message: string;
}

export default function Error({ status, message }: ErrorProps) {
    const page = usePage();
    const url = page.props.url as string;
    const auth = page.props.auth as { user: { name: string, userid: string } } | null;
    const [isLoading, setIsLoading] = useState(false);

    const handleNavigation = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Add a delay before navigation
        setTimeout(() => {
            window.location.href = auth ? url + "/" : url + "/login";
        }, 1000);
    };

    return (
        <AppLayout>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "60vh",
                    textAlign: "center",
                    py: 4,
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: "6rem",
                        fontWeight: "bold",
                        color: "error.main",
                        mb: 2,
                    }}
                >
                    {status}
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        mb: 3,
                        color: "text.primary",
                    }}
                >
                    Something went wrong
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        color: "text.secondary",
                        maxWidth: "600px",
                    }}
                >
                    {message || "An unexpected error occurred. Please try again later."}
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleNavigation}
                    disabled={isLoading}
                    sx={{
                        px: 4,
                        py: 1.5,
                    }}
                >
                    {isLoading ? "Redirecting..." : (auth ? "Go to Home" : "Go to Login")}
                </Button>
            </Box>
        </AppLayout>
    );
}