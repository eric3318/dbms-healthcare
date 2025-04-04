import styles from './topbar.module.css';
import { Button, Text, Group } from '@mantine/core';
import { checkAuth, logout } from '../utils/data';
import { User } from '../lib/types';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

export default function Topbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const authenticated = !!user;

    useEffect(() => {
        const getData = async () => {
            const user = await checkAuth();
            setUser(user);
        };
        getData();
    }, []);

    return (
        <div className={styles.container}>
            {authenticated ? (
                <Group>
                    <Text fw={500} size="lg">
                        Welcome, {user?.name}
                    </Text>

                    <Button onClick={() => logout()}>Logout</Button>
                    <Button component={Link} to="/profile">
                        Profile
                    </Button>
                </Group>
            ) : (
                <Button variant="subtle" color="indigo" size="lg" onClick={() => navigate('/signin')}>
                    Sign in
                </Button>
            )}
        </div>
    );
}
