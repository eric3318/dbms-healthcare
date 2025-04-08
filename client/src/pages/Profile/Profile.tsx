import { Button, Stack } from '@mantine/core';
import { Link, useNavigate, Outlet } from 'react-router';
import styles from './profile.module.css';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth/useAuth';
const options = [
    { label: 'Personal Information', value: 'personal-information' },
    { label: 'My Appointments', value: 'appointments' },
    { label: 'Medical History', value: 'medical-history' },
];

export default function Profile() {
    const { authenticated } = useAuth();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!authenticated) {
    //         navigate('/signin');
    //     }
    // }, [authenticated, navigate]);

    const [option, setOption] = useState<string>('appointments');

    return (
        <div className={styles.container}>
            <Stack gap={0}>
                {options.map((option) => (
                    <Button
                        key={option.value}
                        component={Link}
                        to={`/profile/${option.value}`}
                        variant="white"
                        c="dark"
                        size="lg"
                        radius={0}
                        h={72}
                        justify="flex-start"
                    >
                        {option.label}
                    </Button>
                ))}
            </Stack>

            <Outlet />
        </div>
    );
}
