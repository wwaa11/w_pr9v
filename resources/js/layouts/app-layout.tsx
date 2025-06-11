import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { router, usePage } from '@inertiajs/react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

const pages = [
    {
        'name': 'Index',
        'link': '/',
    },
    {
        'name': 'Consent',
        'link': 'telemedicine/eyJpdiI6IkM2RURDSHFFdWpBZW9ES0hHdVJHWlE9PSIsInZhbHVlIjoiQkNlVVVneE50VHNnbzQ3SkZITnprdz09IiwibWFjIjoiOTc1MDJhNWY3ZDQxMWI1ZGMwYTI4NTI5YWVlMzUyNGU2ZjI5ZjJkNzgwMjBhYmRjN2VjZDFhM2JlZGEyMWMzZCIsInRhZyI6IiJ9',
    },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const page = usePage();
    const url = page.props.url as string;
    const auth = page.props.auth as { user: { name: string, userid: string } };

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    function handleMenuPages(link: string) {
        router.visit(`${url}/${link}`);
    }

    function stringToColor(string: string) {
        let hash = 0;
        let i;

        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }

        let color = '#';

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }

        return color;
    }

    function stringAvatar(name: string) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }

    return (
        <Box>
            <AppBar position="sticky">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <img
                            src="images/Logo.png"
                            alt="Praram9 Logo"
                            style={{ width: 40, height: 40, marginRight: 16, cursor: 'pointer' }}
                            onClick={() => handleMenuPages('/')}
                            className='flex'
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            onClick={() => handleMenuPages('/')}
                            sx={{
                                mr: 2,
                                fontWeight: 600,
                                color: 'inherit',
                                cursor: 'pointer'
                            }}
                        >
                            Praram9 Hospital
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: 'flex' }}>
                            {pages.map((page) => (
                                <Button
                                    key={page.name}
                                    onClick={() => handleMenuPages(page.link)}
                                    sx={{ my: 2, paddingTop: 1, paddingX: 3, fontWeight: 600, color: 'white', display: 'block' }}
                                >
                                    {page.name}
                                </Button>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <Typography
                                    onClick={handleOpenUserMenu}
                                    variant="h6"
                                    noWrap
                                    component="a"
                                    href="#app-bar-with-responsive-menu"
                                    sx={{
                                    }}
                                >
                                    <Avatar {...stringAvatar(auth.user.name)} />
                                </Typography>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={() => router.post(`${url}/logout`)}>
                                    <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container maxWidth="md">
                <main className="min-h-screen">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </Container>
        </Box>
    );
}