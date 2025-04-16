import { Container, Stack, Title, Text, Button, rem } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
    return (
        <Container size="md" style={{ height: '100vh' }}>
            <Stack align="center" justify="center" style={{ height: '100%' }} gap="xl">
                <IconLock size={rem(80)} color="var(--mantine-color-red-6)" stroke={1.5} />
                <Title order={1} ta="center" c="red.6">
                    401 - Unauthorized Access
                </Title>
                <Text size="lg" ta="center" c="dimmed" maw={600}>
                    Sorry, you don't have permission to access this page. Please make sure you're logged in with the
                    correct credentials.
                </Text>
                <Stack gap="md">
                    <Button component={Link} to="/" variant="subtle" size="md">
                        Return to Home
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
}
