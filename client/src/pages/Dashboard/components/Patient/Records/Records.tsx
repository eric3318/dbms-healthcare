<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { Box, Title, Text, Card, Group, Stack, Button } from '@mantine/core';
import { Link } from 'react-router';
import { components } from '../../../../../lib/api';
import useAuth from '../../../../../hooks/useAuth/useAuth';

type MedicalRecord = components['schemas']['MedicalRecord'];

export default function Records() {
    const { user } = useAuth();
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMedicalRecords = async () => {
            try {
                const response = await fetch(`/api/medical-records/patient/${user?.profile?.id}`, {
                    credentials: 'include',
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch medical records');
                }

                const data = await response.json();
                setMedicalRecords(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (user?.profile?.id) {
            fetchMedicalRecords();
        }
    }, [user?.profile?.id]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text color="red">{error}</Text>;
    }

    if (medicalRecords.length === 0) {
        return <Text>No medical records found</Text>;
    }

    return (
        <Box p="md">
            <Title order={2} mb="md">Medical Records</Title>
            
            <Stack spacing="md">
                {medicalRecords.map((record) => (
                    <Card key={record.id} shadow="sm" p="lg" radius="md" withBorder>
                        <Group position="apart">
                            <Stack spacing="xs">
                                <Text fw={500}>Visit Reason: {record.visitReason}</Text>
                                <Text size="sm" c="dimmed">
                                    Created: {new Date(record.createdAt).toLocaleDateString()}
                                </Text>
                            </Stack>
                            
                            <Button 
                                component={Link} 
                                to={`/medical-records/${record.id}`}
                                variant="light"
                            >
                                View Details
                            </Button>
                        </Group>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
=======
import { fetchAppointments } from '../../../../../utils/data';
import { useEffect, useState } from 'react';
import useAuth from '../../../../../hooks/useAuth/useAuth';

export default function Records() {
    const { user } = useAuth();
    const [medicalRecords, setMedicalRecords] = useState([]);

    useEffect(() => {
        getMedicalRecords();
    }, []);

    const getMedicalRecords = async () => {
        // TODO: Fetch medical records
    };

    return <div></div>;
>>>>>>> temp-main
}
