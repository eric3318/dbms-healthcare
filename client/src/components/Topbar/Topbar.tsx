import styles from './topbar.module.css';
import { Button, Text, Group, Loader } from '@mantine/core';
import { Link, useLocation } from 'react-router';
import clsx from 'clsx';
import UserOptions from './UserOptions/UserOptions';
import useAuth from '../../hooks/useAuth/useAuth';

const links = [
    {
        label: 'HOME',
        href: '/',
    },
    {
        label: 'OUR TEAM',
        href: '/our-team',
    },
    {
        label: 'SERVICES',
        href: '/services',
    },
    {
        label: 'CONTACT US',
        href: '/contact-us',
    },
];

export default function Topbar() {
    const { user, authenticated } = useAuth();
    const location = useLocation();
    const activeLink = location.pathname;

    return (
        <div className={styles.container}>
            <Group gap="xl">
                {links.map((link) => (
                    <Button
                        key={link.label}
                        component={Link}
                        to={link.href}
                        variant="transparent"
                        size="lg"
                        className={clsx(styles.link, activeLink === link.href && styles.activeLink)}
                    >
                        {link.label}
                    </Button>
                ))}
            </Group>

            {authenticated === undefined ? (
                <Loader />
            ) : authenticated ? (
                <Group>
                    <Text fw="bold" size="lg">
                        Welcome, {user?.profile?.name}
                    </Text>

                    <Button component={Link} to="/dashboard" size="lg" variant="light" radius="md" h={40}>
                        Dashboard
                    </Button>

                    <UserOptions />
                </Group>
            ) : (
                <Button variant="filled" color="indigo" size="lg" component={Link} to="/signin">
                    Sign in
                </Button>
            )}
        </div>
    );
}
