import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Profile from './pages/Profile/Profile';
import Home from './pages/Home/Home';
import './App.css';
import Root from './pages/Root/Root';
import Auth from './pages/Auth/Auth';
import OurTeam from './pages/OurTeam/OurTeam';
import AuthProvider from './hooks/useAuth/AuthProvider';
import Availability from './pages/Booking/Availability/Availability';
import Information from './pages/Profile/Information/Information';
import MedicalHistory from './pages/Profile/MedicalHistory.tsx/MedicalHistory';
import Dashboard from './pages/Dashboard/Dashboard';
import Services from './pages/Services/Services';
import ContactUs from './pages/ContactUs/ContactUs';
import Booking from './pages/Booking/Booking';
import ProtectedLayout from './pages/ProtectedLayout/ProtectedLayout';
import Unauthorized from './pages/Unauthorized/Unauthorized';
import VerificationForm from './components/VerificationForm/VerificationForm';
import { Notifications } from '@mantine/notifications';
const router = createBrowserRouter([
    {
        path: '/',
        Component: Root,
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
                element: <ProtectedLayout allowedRoles={['PATIENT']} />,
                children: [
                    {
                        path: '/booking/:doctorId',
                        Component: Availability,
                    },
                ],
            },

            {
                path: '/our-team',
                Component: OurTeam,
            },
            {
                path: '/services',
                Component: Services,
            },
            {
                path: '/contact-us',
                Component: ContactUs,
            },
            {
                path: '/profile',
                Component: Profile,
                children: [
                    {
                        path: 'personal-information',
                        Component: Information,
                    },
                    {
                        path: 'medical-history',
                        Component: MedicalHistory,
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
        element: <Auth isSignIn={true} />,
    },
    {
        path: '/signup',
        element: <Auth isSignIn={false} />,
    },
    {
        path: '/verify',
        Component: VerificationForm,
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
