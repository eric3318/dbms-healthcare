import { Avatar, Button, Divider, Group, Select, Switch, Text } from '@mantine/core';
import styles from './verticalBar.module.css';
import { User } from '../../lib/types';
import { Stack } from '@mantine/core';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth/useAuth';
import { useNavigate } from 'react-router';

type Option = {
    label: string;
    value: string;
};

type Props = {
    user: User;
    selectedRole: string;
    options: Option[];
    active: string;
    onChange: (value: string) => void;
    onRoleChange: (value: string) => void;
};

export default function VerticalBar({ user, selectedRole, options, active, onChange, onRoleChange }: Props) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/signin');
    };

    return (
        <div className={styles.container}>
            <Stack>
                {user && (
                    <Group>
                        {/* fetch user image somewhere */}
                        <Avatar src={'/'} size={56} />

                        <Stack gap={2}>
                            <Text fw={500} size="xl">
                                {user?.profile?.name}
                            </Text>
                            <Text c="dimmed">{selectedRole}</Text>
                        </Stack>
                    </Group>
                )}

                {/* Implement role switching */}

                <Divider />

                <Stack gap={0}>
                    {options.map((option) => (
                        <Button
                            key={option.value}
                            variant={active === option.value ? 'light' : 'white'}
                            c="dark"
                            size="lg"
                            radius={0}
                            h={64}
                            onClick={() => onChange(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </Stack>
            </Stack>

            <Stack>
                <Divider />

                <Stack gap={0}>
                    <Button component={Link} to="/" variant="subtle" size="lg" radius={0} h={64}>
                        Home
                    </Button>

                    <Button onClick={handleLogout} variant="subtle" size="lg" radius={0} h={64}>
                        Log out
                    </Button>
                </Stack>
            </Stack>
        </div>
    );
}
