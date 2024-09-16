"use client"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AccountCircle, Dashboard, EventBusy, ReceiptLong, Today, Work } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from "@/hooks/auth"
import NotAllowed from '@/components/NotAllowed';
import Dropdown from '@/components/Dropdown'
import { DropdownButton } from '@/components/DropdownLink'

const drawerWidth = 240;

const scheduleItems = [
    {
        title: 'Appointments',
        url: '/doctor/appointments',
        icon: <Today />,
        activeUrls: ['/doctor/appointments', '/doctor/appointment-calendar-view']

    },
    {
        title: 'Transactions',
        url: '/doctor/transactions',
        icon: <ReceiptLong />,
        activeUrls: ['/doctor/transactions']
    },
];


const settingItems = [
    {
        title: 'Profile',
        url: '/doctor/profile',
        icon: <AccountCircle />
    },
];

const hospitalAdminItems = [
    {
        title: 'My Schedule',
        url: '/doctor/doctor-schedule-edit',
        icon: <Work />
    },
    {
        title: 'Holiday',
        url: '/doctor/holidays',
        icon: <EventBusy />
    },
]

const Doctor = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const currentPage = usePathname();

    const router = useRouter()
    const { logout } = useAuth()

    React.useEffect(() => {
        console.log(window.location.pathname)
        if (window.location.pathname === '/doctor') {
            router.push('/doctor/dashboard')
        }
    }, [router])

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <div>
            {/* <Toolbar /> */}
            <Divider />
            <div
                className="
                    w-[240px] h-full
                    fixed inset-y-0 start-0 z-[60]
                    bg-white border-e border-gray-200
                    lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
                "
                role="dialog"
                tabIndex="-1"
                aria-label="Sidebar"
            >
                <div className="relative flex flex-col h-full max-h-full">
                    <div className="px-6 py-4">
                        <Link
                            className="flex-none rounded-xl text-xl font-semibold focus:outline-none focus:opacity-80"
                            href="/"
                            aria-label="Preline"
                        >
                            <p>eClinicNexus.</p>
                        </Link>
                        <span className='text-xs'>Hospital Management Software</span>
                    </div>
                    <Divider />

                    <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
                        <nav className="hs-accordion-group p-3 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
                            <ul className="flex flex-col space-y-1">
                                <li>
                                    <Link
                                        href='/doctor/dashboard'
                                        className={
                                            `flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg font-medium ${currentPage === '/doctor/dashboard'
                                                ? "bg-[#4f46e5] text-white"
                                                : "text-gray-800 hover:bg-gray-100"
                                            }`
                                        }
                                    >
                                        <Dashboard />
                                        Dashboard
                                    </Link>

                                </li>

                                <span className='text-sm !mt-6 text-gray-700'>My Schedule</span>
                                {scheduleItems.map((item) => (
                                    <li key={item.url}>
                                        <Link
                                            href={item.url}
                                            className={
                                                `flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg font-medium ${item.activeUrls.some(url => currentPage.startsWith(url))
                                                    ? "bg-[#4f46e5] text-white"
                                                    : "text-gray-800 hover:bg-gray-100"
                                                }`
                                            }
                                        >
                                            <span>{item.icon}</span>
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}

                                <span className='text-sm !mt-6'>Hospital Administration</span>
                                {hospitalAdminItems.map((item) => (
                                    <li key={item.url}>
                                        <Link
                                            href={item.url}
                                            className={
                                                `flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg font-medium ${currentPage.startsWith(item.url)
                                                    ? "bg-[#4f46e5] text-white"
                                                    : "text-gray-800 hover:bg-gray-100"
                                                }`
                                            }
                                        >
                                            <span>{item.icon}</span>
                                            {item.title}
                                        </Link>

                                    </li>
                                ))}


                                <span className='text-sm !mt-6'>Settings</span>
                                {settingItems.map((item) => (
                                    <li key={item.url}>
                                        <Link
                                            href={item.url}
                                            className={
                                                `flex items-center gap-x-3.5 py-2 px-2.5 text-sm rounded-lg font-medium ${currentPage.startsWith(item.url)
                                                    ? "bg-[#4f46e5] text-white"
                                                    : "text-gray-800 hover:bg-gray-100"
                                                }`
                                            }
                                        >
                                            <span>{item.icon}</span>
                                            {item.title}
                                        </Link>

                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div >

            < Divider />
        </div >
    );

    return (
        user.role_id == process.env.NEXT_PUBLIC_DOCTOR_ID ?
            <Box sx={{ display: 'flex' }}>
                <AppBar
                    position="fixed"
                    sx={{
                        backgroundColor: '#FFFFFF',
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                        border: 1,
                        borderColor: '#E5E7EB',
                    }}
                    elevation={0}
                >
                    <Toolbar variant="dense">
                        <IconButton
                            color="black"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            color={'black'}
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            HMS
                        </Typography>
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <Dropdown
                                align="right"
                                width="48"
                                trigger={
                                    <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                        <div>{user?.name}</div>

                                        <div className="ml-1">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                }>
                                {/* Authentication */}
                                <DropdownButton onClick={logout}>
                                    Logout
                                </DropdownButton>
                            </Dropdown>
                        </div>
                    </Toolbar>
                </AppBar>

                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onTransitionEnd={handleDrawerTransitionEnd}
                        onClose={handleDrawerClose}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, px: 3, py: 8, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    {children}
                </Box>
            </Box>
            :
            <NotAllowed />
    );
}

export default Doctor;
