import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { router, usePage } from '@inertiajs/react';
import { PageContainer } from '@toolpad/core/PageContainer';

const customsTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

interface NavigationItem {
    kind?: 'header';
    segment?: string;
    title: string;
    icon?: React.ReactNode;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const page = usePage();
    const url = page.props.url as string;
    const auth = page.props.auth as { user: { name: string, userid: string } };

    const NAVIGATION: NavigationItem[] = [
        {
            kind: 'header',
            title: 'Consents',
        },
        {
            segment: 'index',
            title: 'Generate Link',
            icon: <DescriptionIcon />,
        },
        {
            kind: 'header',
            title: 'Tester',
        },
        {
            title: 'Telemedince Consent',
            icon: <DescriptionIcon />,
            segment: 'search'
        },
        ...(auth ? [
            {
                segment: 'logout',
                title: 'Logout',
                icon: <DescriptionIcon />,
            }
        ] : []),
    ];

    const handleNavigation = (segment: string) => {
        if (segment === 'logout') {
            router.post(`${url}/logout`);
        } else {
            router.visit(`${url}/${segment}`);
        }
    };

    return (
        <AppProvider
            branding={{
                logo: <img src="images/Logo.png" alt="Praram9 Hospital logo" />,
                title: 'Praram9 Hospital',
                homeUrl: url
            }}
            navigation={NAVIGATION as Navigation}
            theme={customsTheme}
        >
            <DashboardLayout>
                <PageContainer>
                    {children}
                </PageContainer>
            </DashboardLayout>
        </AppProvider>
    );
}