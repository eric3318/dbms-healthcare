import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Profile from './pages/Profile/Profile';
import Home from './pages/Home/Home';
import './App.css';
import Root from './pages/Root/Root';
import Auth from './pages/Auth/Auth';
import OurTeam from './pages/OurTeam/OurTeam';
import AuthProvider from './hooks/useAuth/AuthProvider';
import Booking from './pages/Booking/Booking';
import Information from './pages/Profile/Information/Information';
import MedicalHistory from './pages/Profile/MedicalHistory.tsx/MedicalHistory';
import Dashboard from './pages/Dashboard/Dashboard';
import Services from './pages/Services/Services';
import ContactUs from './pages/ContactUs/ContactUs';
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
                path: '/dashboard',
                Component: Dashboard,
            },
            {
                path: '/booking',
                Component: Booking,
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
        path: '/signin',
        element: <Auth isSignIn={true} />,
    },
    {
        path: '/signup',
        element: <Auth isSignIn={false} />,
    },
]);

function App() {
    return (
        <MantineProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </MantineProvider>
    );
}

export default App;
