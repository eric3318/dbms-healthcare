import { useState, useEffect } from 'react';
import { Card, Text, Badge, Group, Stack, Button, Avatar, Grid, Title } from '@mantine/core';
import { IconFlask, IconCalendar, IconClock, IconFileDescription } from '@tabler/icons-react';
import useAuth from '../../../../../hooks/useAuth/useAuth';
import { components } from '../../../../../lib/api';

type Requisition = components['schemas']['Requisition'];
type RequisitionResult = components['schemas']['RequisitionResult'];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function Requisitions() {
    const [requisitions, setRequisitions] = useState<Requisition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        console.log('Current user in Requisitions:', user);
        fetchRequisitions();
    }, [user]); // When user is ready, reload

    const getMockRequisitions = (medicalRecordId: string = 'medrec-1'): Requisition[] => {
        return [
            {
                id: 'req-1',
                medicalRecordId: medicalRecordId,
                testName: 'Complete Blood Count',
                status: 'Pending',
                requestedAt: '2025-04-01T08:30:00Z',
                updatedAt: '2025-04-01T08:30:00Z'
            },
            {
                id: 'req-2',
                medicalRecordId: medicalRecordId,
                testName: 'Lipid Panel',
                status: 'Completed',
                result: {
                    description: 'Cholesterol: 180 mg/dL, HDL: 60 mg/dL, LDL: 100 mg/dL, Triglycerides: 120 mg/dL',
                    conclusion: 'Normal lipid profile',
                    reportedAt: '2025-04-02T14:30:00Z'
                },
                requestedAt: '2025-04-01T09:00:00Z',
                updatedAt: '2025-04-02T14:30:00Z'
            },
            {
                id: 'req-3',
                medicalRecordId: medicalRecordId,
                testName: 'Liver Function Test',
                status: 'Pending_result',
                requestedAt: '2025-04-01T10:15:00Z',
                updatedAt: '2025-04-02T09:20:00Z'
            }
        ];
    };

    const fetchRequisitions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // First try to fetch real data from the API if user is logged in
            if (user && (user.sub || user.id)) {
                try {
                    const userId = user.sub || user.id;
                    console.log('Attempting to fetch real requisitions data for user:', userId);
                    
                    // Use the correct API endpoint for fetching requisitions by user ID
                    const endpoint = `${API_URL}/requisitions/by-user/${encodeURIComponent(userId)}`;
                    console.log('Fetching requisitions from:', endpoint);
                    
                    const response = await fetch(endpoint, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    
                    if (!response.ok) {
                        // Handle specific error codes
                        if (response.status === 500) {
                            console.error('Server error when fetching requisitions. This could be due to missing patient-user mapping in the database.');
                        }
                        throw new Error(`API responded with status ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log('Fetched requisitions data:', data);
                    
                    if (Array.isArray(data) && data.length > 0) {
                        console.log('Successfully loaded real requisition data from API');
                        setRequisitions(data);
                        setLoading(false);
                        return; // Exit if we successfully got the data
                    } else {
                        console.log('API returned empty result, falling back to mock data');
                    }
                } catch (apiError) {
                    console.error('API request failed:', apiError);
                    console.log('Falling back to mock data due to API error');
                    // Continue to mock data as fallback
                }
            } else {
                console.log('User not fully authenticated or missing identifier, using mock data');
            }
            
            // Fall back to mock data if API request fails or user is not logged in
            console.log('Using mock requisitions data as fallback');
            // Pass the user's email as medicalRecordId if available
            const mockId = user?.sub || user?.id || 'medrec-1';
            setRequisitions(getMockRequisitions(mockId));
            setLoading(false);
        } catch (error) {
            console.error('Error in fetchRequisitions:', error);
            setError(`Failed to load requisitions: ${error instanceof Error ? error.message : 'Unknown error'}`);
            const mockId = user?.sub || user?.id || 'medrec-1';
            setRequisitions(getMockRequisitions(mockId));
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string | undefined) => {
        if (!status) return <Badge color="gray" size="lg">Unknown</Badge>;

        switch (status) {
            case 'Completed':
                return <Badge color="green" size="lg">Completed</Badge>;
            case 'Pending_result':
                return <Badge color="yellow" size="lg">Pending Result</Badge>;
            case 'Pending':
                return <Badge color="blue" size="lg">Pending</Badge>;
            default:
                return <Badge color="gray" size="lg">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return <Text>Loading your lab tests...</Text>;
    }

    if (error) {
        return (
            <div>
                <Text color="red" mb="md">{error}</Text>
                <Button onClick={fetchRequisitions}>Try Again</Button>
            </div>
        );
    }

    const sortedRequisitions = [...requisitions].sort((a, b) => {
        const statusOrder: Record<string, number> = {
            'Pending': 0,
            'Pending_result': 1,
            'Completed': 2
        };

        const statusA = a.status || '';
        const statusB = b.status || '';

        if (statusOrder[statusA] !== statusOrder[statusB]) {
            return statusOrder[statusA] - statusOrder[statusB];
        }

        const dateA = new Date(a.requestedAt || '');
        const dateB = new Date(b.requestedAt || '');
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <div>
            <Group justify="space-between" mb="md">
                <Title order={2}>My Lab Tests</Title>
                <Group>
                    {error && (
                        <Badge color="red" size="lg" mr="sm">API ERROR - USING MOCK DATA</Badge>
                    )}
                    <Button variant="light" onClick={fetchRequisitions}>Refresh</Button>
                </Group>
            </Group>

            <Grid>
                {sortedRequisitions.length === 0 ? (
                    <Text size="lg" ta="center" w="100%" mt="xl">
                        No lab tests found
                    </Text>
                ) : (
                    sortedRequisitions.map((req) => (
                        <Grid.Col key={req.id} span={4}>
                            <Card shadow="sm" padding="lg" radius="md" withBorder>
                                <Card.Section withBorder p="md">
                                    <Group justify="space-between">
                                        <Group>
                                            <Avatar color={req.status === 'Completed' ? 'green' : req.status === 'Pending_result' ? 'yellow' : 'blue'} radius="xl">
                                                <IconFlask size={24} />
                                            </Avatar>
                                            <Text fw={700} size="lg">{req.testName}</Text>
                                        </Group>
                                        {getStatusBadge(req.status)}
                                    </Group>
                                </Card.Section>

                                <Stack gap="xs" mt="md">
                                    <Group>
                                        <IconCalendar size={18} />
                                        <Text size="sm" fw={500}>Requested:</Text>
                                        <Text size="sm">{formatDate(req.requestedAt)}</Text>
                                    </Group>

                                    {req.status === 'Completed' && req.result && (
                                        <>
                                            <Group>
                                                <IconClock size={18} />
                                                <Text size="sm" fw={500}>Results Ready:</Text>
                                                <Text size="sm">{formatDate(req.result.reportedAt)}</Text>
                                            </Group>

                                            <Group align="flex-start">
                                                <IconFileDescription size={18} style={{ marginTop: '3px' }} />
                                                <Stack gap={0}>
                                                    <Text size="sm" fw={500}>Conclusion:</Text>
                                                    <Text size="sm">{req.result.conclusion}</Text>
                                                </Stack>
                                            </Group>
                                        </>
                                    )}

                                    {req.status === 'Pending' && (
                                        <Text size="sm" c="dimmed" mt="xs">
                                            Your test is ordered. Please follow your doctor's instructions for test preparation.
                                        </Text>
                                    )}

                                    {req.status === 'Pending_result' && (
                                        <Text size="sm" c="dimmed" mt="xs">
                                            Your test has been performed. Results are being processed and will be available soon.
                                        </Text>
                                    )}
                                </Stack>

                                {req.status === 'Completed' && (
                                    <Button variant="light" color="blue" fullWidth mt="md">
                                        View Detailed Results
                                    </Button>
                                )}
                            </Card>
                        </Grid.Col>
                    ))
                )}
            </Grid>
        </div>
    );
}