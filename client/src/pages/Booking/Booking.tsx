import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doctor, getAllDoctors } from '../../utils/doctors';
import styles from './booking.module.css';
import {
    Button,
    Card,
    Container,
    Select,
    Title,
    Text,
    LoadingOverlay,
    Alert,
    Stack,
    Group,
    Avatar,
    Badge,
    SimpleGrid,
} from '@mantine/core';
import { IconAlertCircle, IconStethoscope } from '@tabler/icons-react';

const Booking = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [specialtyFilter, setSpecialtyFilter] = useState<string>('');
    const [specialties, setSpecialties] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const data = await getAllDoctors();
                setDoctors(data || []);

                const uniqueSpecialties = Array.from(
                    new Set((data || []).map((doctor) => doctor.specialization || '').filter((specialty) => specialty)),
                );
                setSpecialties(uniqueSpecialties);

                setLoading(false);
            } catch (err) {
                setError('Failed to load doctors. Please try again later.');
                setLoading(false);
                console.error('Error fetching doctors:', err);
            }
        };

        fetchDoctors();
    }, []);

    const filteredDoctors = specialtyFilter
        ? doctors.filter((doctor) => doctor.specialization === specialtyFilter)
        : doctors;

    if (loading) {
        return <LoadingOverlay visible={true} />;
    }

    if (error) {
        return (
            <Container size="md">
                <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
                    {error}
                </Alert>
            </Container>
        );
    }

    const handleBookingClick = (doctor: Doctor) => {
        navigate(`/booking/${doctor.id}`, { state: { doctor } });
    };

    return (
        <Container size="xl" className={styles.container}>
            <Stack gap="xl">
                <Group justify="space-between" align="center">
                    <Title order={2}>Book an Appointment</Title>
                    <Select
                        label="Filter by Specialty"
                        placeholder="All Specialties"
                        data={[
                            { value: '', label: 'All Specialties' },
                            ...specialties.map((specialty) => ({
                                value: specialty,
                                label: specialty,
                            })),
                        ]}
                        value={specialtyFilter}
                        onChange={(value) => setSpecialtyFilter(value || '')}
                        style={{ width: '200px' }}
                    />
                </Group>

                {filteredDoctors.length > 0 ? (
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                        {filteredDoctors.map((doctor) => (
                            <Card key={doctor.id} shadow="sm" padding="lg" radius="md" withBorder>
                                <Card.Section p="md">
                                    <Group>
                                        <Avatar size="lg" radius="xl" color="blue" variant="filled">
                                            {(doctor.name || '')
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </Avatar>
                                        <div>
                                            <Text fw={500} size="lg">
                                                {doctor.name}
                                            </Text>
                                            <Badge leftSection={<IconStethoscope size={12} />} variant="light">
                                                {doctor.specialization}
                                            </Badge>
                                        </div>
                                    </Group>
                                </Card.Section>

                                <Button onClick={() => handleBookingClick(doctor)} fullWidth mt="md" variant="filled">
                                    Book Appointment
                                </Button>
                            </Card>
                        ))}
                    </SimpleGrid>
                ) : (
                    <Text className={styles.noResults} c="dimmed" size="lg">
                        {specialtyFilter
                            ? `No doctors found with specialty: ${specialtyFilter}`
                            : 'No doctors available at the moment.'}
                    </Text>
                )}
            </Stack>
        </Container>
    );
};

export default Booking;
