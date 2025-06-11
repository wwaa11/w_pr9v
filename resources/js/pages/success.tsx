import AppLayout from "@/layouts/patient";
import { usePage } from "@inertiajs/react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface SuccessProps {
    message?: string;
}

export default function Success({
    message = "Your request has been successfully processed."
}: SuccessProps) {
    const page = usePage();

    useEffect(() => {
        document.title = "Success";

        // Prevent going back
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, '', window.location.href);
        };

        // Cleanup function
        return () => {
            window.onpopstate = null;
        };
    }, []);

    const handleClose = () => {
        window.close();
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
                <CheckCircleIcon
                    sx={{
                        fontSize: "6rem",
                        color: "success.main",
                        mb: 3,
                        animation: "scaleIn 0.5s ease-out",
                    }}
                />
                <Typography
                    variant="h4"
                    sx={{
                        mb: 2,
                        color: "text.primary",
                        fontWeight: "bold",
                    }}
                >
                    Success!
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 4,
                        color: "text.secondary",
                        maxWidth: "600px",
                    }}
                >
                    {message}
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleClose}
                    startIcon={<CloseIcon />}
                    sx={{
                        px: 4,
                        py: 1.5,
                        animation: "fadeIn 0.5s ease-out",
                        bgcolor: "grey.700",
                        '&:hover': {
                            bgcolor: "grey.800",
                        }
                    }}
                >
                    Close Page
                </Button>
            </Box>

            <style>
                {`
                    @keyframes scaleIn {
                        from {
                            transform: scale(0);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </AppLayout>
    );
}