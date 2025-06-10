import AppLayout from "@/layouts/app-layout";
import { usePage } from "@inertiajs/react";
import Typography from "@mui/material/Typography";

interface ErrorProps {
    message: string;
}

export default function Error({ message }: ErrorProps) {
    const page = usePage();

    return (
        <AppLayout>
            <Typography variant="h5" className="text-red-500" gutterBottom>
                Success
            </Typography>
        </AppLayout>
    );
}