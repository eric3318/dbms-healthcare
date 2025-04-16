import { useState, useEffect } from 'react';
import { Table, Text, Badge, Group, Title, Button } from '@mantine/core';
import useAuth from '../../../../../hooks/useAuth/useAuth';
import { components } from '../../../../../lib/api';

type Requisition = components['schemas']['Requisition'];
type RequisitionResult = components['schemas']['RequisitionResult'];

// Define the API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function RequisitionResults() {
    const [requisitions, setRequisitions] = useState<Requisition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    
    useEffect(() => {
        fetchRequisitions();
    }, []);

    const fetchRequisitions = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // doctorId is the ID of the doctor making the request
            const endpoint = `${API_URL}/requisitions?status=COMPLETED`;
            console.log('Fetching requisitions from:', endpoint);
            
            const response = await fetch(endpoint, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', response.status, errorText);
                throw new Error(`Failed to fetch requisitions: ${response.status} - ${errorText || response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Fetched requisitions data:', data);
            
            if (Array.isArray(data) && data.length > 0) {
                setRequisitions(data);
            } else {
                console.log('No data received from API, using mock data based on exampleData.json');
                // use mock data if API returns empty array
                const mockData: Requisition[] = [
                    {
                        id: 'req-2',
                        medicalRecordId: 'medrec-1',
                        testName: 'Lipid Panel',
                        status: 'COMPLETED',
                        result: {
                            description: 'Cholesterol: 180 mg/dL, HDL: 60 mg/dL, LDL: 100 mg/dL, Triglycerides: 120 mg/dL',
                            conclusion: 'Normal lipid profile',
                            reportedAt: '2025-04-02T14:30:00Z'
                        },
                        requestedAt: '2025-04-01T09:00:00Z',
                        updatedAt: '2025-04-02T14:30:00Z'
                    },
                    {
                        id: 'req-4',
                        medicalRecordId: 'medrec-3',
                        testName: 'Thyroid Function Test',
                        status: 'COMPLETED',
                        result: {
                            description: 'TSH: 2.5 mIU/L, T4: 1.2 ng/dL, T3: 120 ng/dL',
                            conclusion: 'Normal thyroid function',
                            reportedAt: '2025-04-01T09:15:00Z'
                        },
                        requestedAt: '2025-03-30T14:20:00Z',
                        updatedAt: '2025-04-01T09:15:00Z'
                    },
                    {
                        id: 'req-6',
                        medicalRecordId: 'medrec-5',
                        testName: 'Blood Glucose',
                        status: 'COMPLETED',
                        result: {
                            description: 'Fasting glucose: 95 mg/dL',
                            conclusion: 'Normal blood glucose levels',
                            reportedAt: '2025-04-03T11:45:00Z'
                        },
                        requestedAt: '2025-04-02T13:50:00Z',
                        updatedAt: '2025-04-03T11:45:00Z'
                    }
                ];
                setRequisitions(mockData);
            }
        } catch (error) {
            console.error('Error fetching requisitions:', error);
            setError(`Failed to load test results: ${error instanceof Error ? error.message : 'Unknown error'}`);
            
            // when the API fails, use mock data
            console.log('Using mock data due to error');
            const mockData: Requisition[] = [
                {
                    id: 'req-2',
                    medicalRecordId: 'medrec-1',
                    testName: 'Lipid Panel',
                    status: 'COMPLETED',
                    result: {
                        description: 'Cholesterol: 180 mg/dL, HDL: 60 mg/dL, LDL: 100 mg/dL, Triglycerides: 120 mg/dL',
                        conclusion: 'Normal lipid profile',
                        reportedAt: '2025-04-02T14:30:00Z'
                    },
                    requestedAt: '2025-04-01T09:00:00Z',
                    updatedAt: '2025-04-02T14:30:00Z'
                },
                {
                    id: 'req-4',
                    medicalRecordId: 'medrec-3',
                    testName: 'Thyroid Function Test',
                    status: 'COMPLETED',
                    result: {
                        description: 'TSH: 2.5 mIU/L, T4: 1.2 ng/dL, T3: 120 ng/dL',
                        conclusion: 'Normal thyroid function',
                        reportedAt: '2025-04-01T09:15:00Z'
                    },
                    requestedAt: '2025-03-30T14:20:00Z',
                    updatedAt: '2025-04-01T09:15:00Z'
                }
            ];
            setRequisitions(mockData);
        } finally {
            setLoading(false);
        }
    };
    
    const getStatusBadge = (status: string | undefined) => {
        if (!status) return <Badge color="gray">Unknown</Badge>;
        
        switch(status) {
            case 'COMPLETED':
                return <Badge color="green">Completed</Badge>;
            case 'IN_PROGRESS':
                return <Badge color="yellow">In Progress</Badge>;
            case 'PENDING':
                return <Badge color="blue">Pending</Badge>;
            default:
                return <Badge color="gray">{status}</Badge>;
        }
    };
    
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return <Text>Loading requisition results...</Text>;
    }

    if (error) {
        return (
            <div>
                <Text color="red" mb="md">{error}</Text>
                <Button onClick={fetchRequisitions}>Try Again</Button>
            </div>
        );
    }

    return (
        <div>
            <Group justify="space-between" mb="md">
                <Title order={2}>Lab Test Results</Title>
                <Button onClick={fetchRequisitions} variant="light">Refresh</Button>
            </Group>
            
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Test Name</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Medical Record ID</Table.Th>
                        <Table.Th>Requested Date</Table.Th>
                        <Table.Th>Results</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {requisitions.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={5} align="center">
                                No requisition results found
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        requisitions.map((req) => (
                            <Table.Tr key={req.id}>
                                <Table.Td>{req.testName}</Table.Td>
                                <Table.Td>{getStatusBadge(req.status)}</Table.Td>
                                <Table.Td>{req.medicalRecordId}</Table.Td>
                                <Table.Td>{formatDate(req.requestedAt)}</Table.Td>
                                <Table.Td>
                                    {req.result ? (
                                        <Group>
                                            <Text size="sm" fw={500}>Conclusion:</Text>
                                            <Text size="sm">{req.result.conclusion}</Text>
                                        </Group>
                                    ) : (
                                        <Text size="sm" c="dimmed">No results available</Text>
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        ))
                    )}
                </Table.Tbody>
            </Table>
        </div>
    );
}