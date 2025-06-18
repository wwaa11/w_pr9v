import { useEffect } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

export default function SessionCheck() {
    const page = usePage();
    const url = page.props.url as string;

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get(`${url}/api/check-session`);
                if (!response.data.valid) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Session check failed:', error);
                window.location.reload();
            }
        };

        // Check session immediately
        checkSession();

        // Set up interval to check every 2 hours
        const intervalId = setInterval(checkSession, 2 * 60 * 60 * 1000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return null; // This component doesn't render anything
} 