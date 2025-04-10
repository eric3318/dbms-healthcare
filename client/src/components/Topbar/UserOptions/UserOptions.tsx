import { Popover, Text, Button, Stack, Avatar, UnstyledButton } from '@mantine/core';
import { Link } from 'react-router';
import useAuth from '../../../hooks/useAuth/useAuth';
import { useState } from 'react';

export default function UserOptions() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover width="auto" position="bottom" withArrow shadow="md" opened={isOpen} onChange={setIsOpen}>
            <Popover.Target>
                <UnstyledButton onClick={() => setIsOpen((prev) => !prev)}>
                    <Avatar src={user?.profile?.image} />
                </UnstyledButton>
            </Popover.Target>

            <Popover.Dropdown>
                <Stack>
                    <Button
                        component={Link}
                        to="/profile"
                        size="lg"
                        variant="white"
                        c="dark"
                        justify="flex-start"
                        onClick={() => setIsOpen(false)}
                    >
                        My Profile
                    </Button>

                    <Button
                        onClick={async () => {
                            setIsOpen(false);
                            await logout();
                        }}
                        variant="white"
                        size="lg"
                        c="dark"
                        justify="flex-start"
                    >
                        Logout
                    </Button>
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
