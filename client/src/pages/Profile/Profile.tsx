import { Button, Stack } from '@mantine/core';
import { Link, useNavigate, Outlet } from 'react-router';
import styles from './profile.module.css';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth/useAuth';

const options = [
    { label: 'Personal Information', value: 'personal-information' },
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

    return (
        <div className={styles.container}>
            <Outlet />
        </div>
    );
}
