import { useState, useEffect } from 'react';
import { Card, Text, Badge, Group, Stack, Button, Avatar, Grid, Title } from '@mantine/core';
import { IconFlask, IconCalendar, IconClock, IconFileDescription, IconList } from '@tabler/icons-react';
import useAuth from '../../../../../hooks/useAuth/useAuth';
import { components } from '../../../../../lib/api';

type Requisition = components['schemas']['Requisition'];
type RequisitionResult = components['schemas']['RequisitionResult'];

export default function Requisitions() {
    const [requisitions, setRequisitions] = useState<Requisition[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    
    useEffect(() => {
        fetchRequisitions();
    }, []);

    const fetchRequisitions = async () => {
        try {
            setLoading(true);
            // 在实际应用中，这里应该根据患者ID获取相关的检验申请
            // 目前我们使用模拟数据
            
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 这里应该是实际API调用
            // const response = await fetch(`${API_URL}/requisitions?patientId=${user.id}`);
            // const data = await response.json();
            
            // 模拟数据
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
                    medicalRecordId: 'medrec-1',
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
                    medicalRecordId: 'medrec-1',
                    testName: 'Liver Function Test',
                    status: 'Pending_result',
                    requestedAt: '2025-04-01T10:15:00Z',
                    updatedAt: '2025-04-02T09:20:00Z'
                },
                {
                    id: 'req-4',
                    medicalRecordId: 'medrec-1',
                    testName: 'Thyroid Function Test',
                    status: 'Pending',
                    requestedAt: '2025-04-05T14:20:00Z',
                    updatedAt: '2025-04-05T14:20:00Z'
                },
                {
                    id: 'req-5',
                    medicalRecordId: 'medrec-1',
                    testName: 'Urinalysis',
                    status: 'Pending',
                    requestedAt: '2025-04-06T11:30:00Z',
                    updatedAt: '2025-04-06T11:30:00Z'
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
                return <Badge color="green" size="lg">Completed</Badge>;
            case 'Pending_result':
                return <Badge color="yellow" size="lg">Awaiting Results</Badge>;
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

    // 按状态和日期排序
    const sortedRequisitions = [...requisitions].sort((a, b) => {
        // 首先按状态排序：Pending, Pending_result, Completed
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
        
        // 然后按请求日期排序（最新的在前面）
        const dateA = new Date(a.requestedAt || '');
        const dateB = new Date(b.requestedAt || '');
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <div>
            <Title order={2} mb="md">My Lab Tests</Title>
            
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