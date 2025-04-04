import { createBrowserRouter, RouterProvider } from 'react-router';
import { MantineProvider } from '@mantine/core';
import Profile from './pages/Profile/Profile';
import Home from './pages/Home/Home';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './App.css';
import Auth from './pages/Auth/Auth';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/profile',
        element: <Profile />,
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
            <RouterProvider router={router} />
        </MantineProvider>
    );
}

export default App;
