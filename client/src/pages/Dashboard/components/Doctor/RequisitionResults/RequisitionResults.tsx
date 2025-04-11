import { useState, useEffect } from 'react';
import { Table, Text, Badge, Group, Title } from '@mantine/core';
import useAuth from '../../../../../hooks/useAuth/useAuth';
import { components } from '../../../../../lib/api';

type Requisition = components['schemas']['Requisition'];
type RequisitionResult = components['schemas']['RequisitionResult'];

export default function RequisitionResults() {
    const [requisitions, setRequisitions] = useState<Requisition[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    
    useEffect(() => {
        fetchRequisitions();
    }, []);

    const fetchRequisitions = async () => {
        try {
            setLoading(true);
            // In a real application, fetch medical records based on doctor ID, then get related requisitions
            // Currently using mock data
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // This should be the actual API call
            // const response = await fetch(`${API_URL}/requisitions?status=Completed`);
            // const data = await response.json();
            
            // Mock data
            const mockData: Requisition[] = [
                {
                    id: 'req-1',
                    medicalRecordId: 'medrec-1',
                    testName: 'Complete Blood Count',
                    status: 'Completed',
                    result: {
                        description: 'Normal blood count values across all parameters.',
                        conclusion: 'No abnormalities detected',
                        reportedAt: '2025-04-02T14:30:00Z'
                    },
                    requestedAt: '2025-04-01T08:30:00Z',
                    updatedAt: '2025-04-02T14:30:00Z'
                },
                {
                    id: 'req-2',
                    medicalRecordId: 'medrec-2',
                    testName: 'Lipid Panel',
                    status: 'Completed',
                    result: {
                        description: 'Cholesterol: 180 mg/dL, HDL: 60 mg/dL, LDL: 100 mg/dL, Triglycerides: 120 mg/dL',
                        conclusion: 'Normal lipid profile',
                        reportedAt: '2025-04-03T10:15:00Z'
                    },
                    requestedAt: '2025-04-01T09:00:00Z',
                    updatedAt: '2025-04-03T10:15:00Z'
                },
                {
                    id: 'req-3',
                    medicalRecordId: 'medrec-3',
                    testName: 'Liver Function Test',
                    status: 'Pending_result',
                    requestedAt: '2025-04-01T10:15:00Z',
                    updatedAt: '2025-04-02T09:20:00Z'
                },
                {
                    id: 'req-4',
                    medicalRecordId: 'medrec-4',
                    testName: 'Thyroid Function Test',
                    status: 'Completed',
                    result: {
                        description: 'TSH: 2.5 mIU/L, T4: 1.2 ng/dL, T3: 120 ng/dL',
                        conclusion: 'Normal thyroid function',
                        reportedAt: '2025-04-04T16:45:00Z'
                    },
                    requestedAt: '2025-03-30T14:20:00Z',
                    updatedAt: '2025-04-04T16:45:00Z'
                },
                {
                    id: 'req-5',
                    medicalRecordId: 'medrec-5',
                    testName: 'Urinalysis',
                    status: 'Pending',
                    requestedAt: '2025-04-03T11:30:00Z',
                    updatedAt: '2025-04-03T11:30:00Z'
                }
            ];
            
            setRequisitions(mockData);
            
        } catch (error) {
            console.error('Error fetching requisitions:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const getStatusBadge = (status: string | undefined) => {
        if (!status) return <Badge color="gray">Unknown</Badge>;
        
        switch(status) {
            case 'Completed':
                return <Badge color="green">Completed</Badge>;
            case 'Pending_result':
                return <Badge color="yellow">Awaiting Results</Badge>;
            case 'Pending':
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

    return (
        <div>
            <Title order={2} mb="md">Lab Test Results</Title>
            
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