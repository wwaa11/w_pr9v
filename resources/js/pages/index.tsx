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
            <main className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
                <p className="text-lg">{data.description}</p>
            </main>
        </AppLayout>
    );
}