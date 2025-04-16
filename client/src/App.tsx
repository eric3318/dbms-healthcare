import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Profile from './pages/Profile/Profile';
import Home from './pages/Home/Home';
import './App.css';
import RootLayout from './pages/RootLayout/RootLayout';
import Auth from './pages/Auth/Auth';
import AuthProvider from './hooks/useAuth/AuthProvider';
import Availability from './pages/Booking/Availability/Availability';
import Dashboard from './pages/Dashboard/Dashboard';
import ContactUs from './pages/ContactUs/ContactUs';
import Booking from './pages/Booking/Booking';
import ProtectedLayout from './pages/ProtectedLayout/ProtectedLayout';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import { Notifications } from '@mantine/notifications';

const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home,
            },
            {
                path: '/booking',
                Component: Booking,
            },
            {
                path: '/services',
                Component: Booking,
            },
            {
                path: '/contact-us',
                Component: ContactUs,
            },
            {
                element: <ProtectedLayout allowedRoles={['PATIENT']} />,
                children: [
                    {
                        path: '/booking/:doctorId',
                        Component: Availability,
                    },
                    {
                        path: '/profile',
                        Component: Profile,
                    },
                ],
            },
        ],
    },
    {
        element: <ProtectedLayout />,
        children: [
            {
                path: '/dashboard',
                Component: Dashboard,
            },
        ],
    },
    {
        path: '/signin',
        element: <Auth />,
    },
    {
        path: '/signup',
        element: <Auth isSignIn={false} />,
    },
    {
        element: <ProtectedLayout allowedRoles={['GUEST']} />,
        children: [
            {
                path: '/verify',
                element: <Auth isVerification={true} />,
            },
        ],
    },
    {
        path: '/unauthorized',
        Component: Unauthorized,
    },
]);

function App() {
    return (
        <MantineProvider>
            <AuthProvider>
                <Notifications />
                <RouterProvider router={router} />
            </AuthProvider>
        </MantineProvider>
    );
}

export default App;
