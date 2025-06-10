import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface IndexProps {
    data: {
        title: string;
        description: string;
    };
}

export default function Index({ data }: IndexProps) {

    return (
        <AppLayout>
            <Head>
                <title>Home</title>
                <meta name="description" content={data.description} />
            </Head>
        </AppLayout>
    );
}