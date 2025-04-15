import { Container, Title, Text, SimpleGrid, Group, Stack } from '@mantine/core';
import { IconPhone, IconMail, IconMapPin, IconClock } from '@tabler/icons-react';
import styles from './ContactUs.module.css';

export default function ContactUs() {
    return (
        <Container size="lg" py="xl">
            <Title order={1} ta="center" mb="xl">Contact Us</Title>
            
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
                {/* Contact Information */}
                <Stack>
                    <Title order={2} mb="md">Get in Touch</Title>
                    <Text size="lg" mb="xl">
                        Have questions or need assistance? We're here to help. Reach out to us through any of the following channels.
                    </Text>

                    <Group mb="md">
                        <IconPhone size={24} color="#228be6" />
                        <div>
                            <Text fw={500}>Phone</Text>
                            <Text c="dimmed">+1 (555) 123-4567</Text>
                        </div>
                    </Group>

                    <Group mb="md">
                        <IconMail size={24} color="#228be6" />
                        <div>
                            <Text fw={500}>Email</Text>
                            <Text c="dimmed">info@healthcareclinic.com</Text>
                        </div>
                    </Group>

                    <Group mb="md">
                        <IconMapPin size={24} color="#228be6" />
                        <div>
                            <Text fw={500}>Address</Text>
                            <Text c="dimmed">123 Healthcare Street, Medical District, City, State 12345</Text>
                        </div>
                    </Group>

                    <Group mb="md">
                        <IconClock size={24} color="#228be6" />
                        <div>
                            <Text fw={500}>Business Hours</Text>
                            <Text c="dimmed">Monday - Friday: 9:00 AM - 5:00 PM</Text>
                            <Text c="dimmed">Saturday: 9:00 AM - 1:00 PM</Text>
                            <Text c="dimmed">Sunday: Closed</Text>
                        </div>
                    </Group>
                </Stack>

                {/* Map Section */}
                <Stack>
                    <Title order={2} mb="md">Our Location</Title>
                    <div className={styles.mapContainer}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2155710122!2d-73.987844924164!3d40.757988971389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </Stack>
            </SimpleGrid>
        </Container>
    );
}
