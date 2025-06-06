export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <main className="">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}