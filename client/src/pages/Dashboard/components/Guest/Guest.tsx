import { Text, Button, Stack, Container, Paper, Group, ThemeIcon, Divider } from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconStethoscope, IconHeartbeat, IconCalendarStats } from '@tabler/icons-react';

export default function Guest() {
    const practitionerFeatures = [
        {
            icon: <IconStethoscope size={28} />,
            title: 'Medical Dashboard',
            description: 'Access your patient appointments, medical records, and practice management tools',
        },
        {
            icon: <IconCalendarStats size={28} />,
            title: 'Appointment Management',
            description: 'Manage your schedule, view upcoming appointments, and handle patient requests',
        },
    ];

    const patientFeatures = [
        {
            icon: <IconHeartbeat size={28} />,
            title: 'Health Records',
            description: 'Access your personal health records, prescriptions, and test results',
        },
        {
            icon: <IconCalendarStats size={28} />,
            title: 'Book Appointments',
            description: 'Schedule appointments with healthcare providers and specialists',
        },
    ];

    return (
        <Container size="sm">
            <Paper shadow="sm" radius="md" p="xl" withBorder>
                <Stack gap="xl">
                    <Stack gap="xs" ta="center">
                        <Text fw={700} size="xl">
                            Welcome to Healthcare Portal
                        </Text>
                        <Text c="dimmed" size="md">
                            Please verify your identity to access the portal
                        </Text>
                    </Stack>

                    <Stack gap="xl">
                        <Stack gap="lg">
                            <Stack gap="xs">
                                <Text fw={600} size="lg" c="blue">
                                    Medical Practitioner
                                </Text>
                                <Text c="dimmed" size="sm">
                                    Access your medical practice dashboard
                                </Text>
                            </Stack>

                            <Stack gap="md">
                                {practitionerFeatures.map((feature, index) => (
                                    <Group key={index} wrap="nowrap" gap="md">
                                        <ThemeIcon size={36} radius="md" variant="light" color="blue">
                                            {feature.icon}
                                        </ThemeIcon>
                                        <div>
                                            <Text fw={500} size="sm">
                                                {feature.title}
                                            </Text>
                                            <Text c="dimmed" size="xs">
                                                {feature.description}
                                            </Text>
                                        </div>
                                    </Group>
                                ))}
                            </Stack>
                        </Stack>

                        <Divider />

                        <Stack gap="lg">
                            <Stack gap="xs">
                                <Text fw={600} size="lg" c="teal">
                                    Patient
                                </Text>
                                <Text c="dimmed" size="sm">
                                    Access your personal health portal
                                </Text>
                            </Stack>

                            <Stack gap="md">
                                {patientFeatures.map((feature, index) => (
                                    <Group key={index} wrap="nowrap" gap="md">
                                        <ThemeIcon size={36} radius="md" variant="light" color="teal">
                                            {feature.icon}
                                        </ThemeIcon>
                                        <div>
                                            <Text fw={500} size="sm">
                                                {feature.title}
                                            </Text>
                                            <Text c="dimmed" size="xs">
                                                {feature.description}
                                            </Text>
                                        </div>
                                    </Group>
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>

                    <Button component={Link} to="/verify" size="lg" fullWidth>
                        Verify Your Identity
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}
