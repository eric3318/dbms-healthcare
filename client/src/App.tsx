import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/Home';
import '@mantine/core/styles.css';
import './App.css';
import { MantineProvider } from '@mantine/core';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
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
