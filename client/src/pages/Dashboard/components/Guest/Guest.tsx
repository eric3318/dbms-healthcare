import { Text, Button, Stack } from '@mantine/core';
import { Link } from 'react-router';

export default function Guest() {
    return (
        <Stack>
            <Text fw={500} size="lg">
                You are logged in as anonymous user
            </Text>
            <Button component={Link} to="/verify">
                Verify your identity
            </Button>
        </Stack>
    );
}
