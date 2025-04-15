import { Stack, Text, Button, SimpleGrid, Card, Group, Container } from '@mantine/core';
import { IconCalendar, IconUser, IconStethoscope, IconChartBar } from '@tabler/icons-react';
import mainImage from '/main.webp';
import styles from './home.module.css';
import { Link } from 'react-router';

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.mainImageContainer}>
                <Stack className={styles.contentContainer}>
                    <Text fz={52} fw={900} c="white">
                        Welcome to our clinic
                    </Text>

                    <div>
                        <Button
                            component={Link}
                            to="/doctor-booking"
                            size="xl"
                            styles={{ root: { backgroundColor: 'red' } }}
                        >
                            Book an appointment
                        </Button>
                    </div>
                </Stack>

                <img src={mainImage} alt="main" className={styles.mainImage} />
            </div>

            <Container size="lg" py="xl">
                <Text fz={32} fw={900} ta="center" mb="xl">
                    Our Services
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Group justify="center" p="md">
                                <IconCalendar size={40} color="#228be6" />
                            </Group>
                        </Card.Section>

                        <Text fw={500} size="lg" mt="md" ta="center">
                            Easy Appointment Booking
                        </Text>

                        <Text size="sm" c="dimmed" mt="sm" ta="center">
                            Book appointments with our specialists quickly and conveniently through our online platform.
                        </Text>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Group justify="center" p="md">
                                <IconUser size={40} color="#228be6" />
                            </Group>
                        </Card.Section>

                        <Text fw={500} size="lg" mt="md" ta="center">
                            Patient-Centric Care
                        </Text>

                        <Text size="sm" c="dimmed" mt="sm" ta="center">
                            Receive personalized care from our dedicated team of healthcare professionals.
                        </Text>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Group justify="center" p="md">
                                <IconStethoscope size={40} color="#228be6" />
                            </Group>
                        </Card.Section>

                        <Text fw={500} size="lg" mt="md" ta="center">
                            Expert Medical Team
                        </Text>

                        <Text size="sm" c="dimmed" mt="sm" ta="center">
                            Access to highly qualified doctors and specialists across various medical fields.
                        </Text>
                    </Card>

                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Card.Section>
                            <Group justify="center" p="md">
                                <IconChartBar size={40} color="#228be6" />
                            </Group>
                        </Card.Section>

                        <Text fw={500} size="lg" mt="md" ta="center">
                            Healthcare Analytics
                        </Text>

                        <Text size="sm" c="dimmed" mt="sm" ta="center">
                            Advanced analytics to track and improve healthcare delivery and patient outcomes.
                        </Text>
                    </Card>
                </SimpleGrid>
            </Container>
        </div>
    );
}
