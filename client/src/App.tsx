import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Profile from './pages/Profile/Profile';
import Home from './pages/Home/Home';
import { Doctors } from './pages/Doctors';
import './App.css';
import Root from './pages/Root/Root';
import Auth from './pages/Auth/Auth';
import OurTeam from './pages/OurTeam/OurTeam';
import AuthProvider from './hooks/useAuth/AuthProvider';
import Appointment from './pages/Appointment/Appointment';
import MyAppointments from './pages/Profile/MyAppointments/MyAppointments';
import Information from './pages/Profile/Information/Information';
import MedicalHistory from './pages/Profile/MedicalHistory.tsx/MedicalHistory';
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
                path: '/doctors',
                Component: Doctors,
            },
            {
                path: '/profile',
                Component: Profile,
                children: [
                    {
                        path: 'appointments',
                        Component: MyAppointments,
                    },
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
            {
                path: '/appointment',
                Component: Appointment,
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
