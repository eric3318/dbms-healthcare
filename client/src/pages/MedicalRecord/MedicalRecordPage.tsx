import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Title, 
    Text, 
    Card, 
    Group, 
    Stack, 
    Button, 
    Modal,
    TextInput,
    Textarea,
    NumberInput,
    ActionIcon,
    Table,
    Badge
} from '@mantine/core';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { components } from '../../lib/api';
import useAuth from '../../hooks/useAuth/useAuth';

type MedicalRecord = components['schemas']['MedicalRecord'];
type MedicalRecordCreateDto = components['schemas']['MedicalRecordCreateDto'];
type MedicalRecordUpdateDto = components['schemas']['MedicalRecordUpdateDto'];

export default function MedicalRecordPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
    const [formData, setFormData] = useState({
        visitReason: '',
        patientDescription: '',
        doctorNotes: '',
        finalDiagnosis: '',
        billingAmount: 0
    });

    useEffect(() => {
        fetchMedicalRecords();
    }, []);

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

    const handleCreate = async () => {
        try {
            const response = await fetch('/api/medical-records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    patientId: user?.profile?.id,
                    doctorId: user?.profile?.doctorId,
                } as MedicalRecordCreateDto),
            });

            if (!response.ok) {
                throw new Error('Failed to create medical record');
            }

            await fetchMedicalRecords();
            setIsCreateModalOpen(false);
            setFormData({
                visitReason: '',
                patientDescription: '',
                doctorNotes: '',
                finalDiagnosis: '',
                billingAmount: 0
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleUpdate = async () => {
        if (!selectedRecord) return;

        try {
            const response = await fetch(`/api/medical-records/${selectedRecord.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData as MedicalRecordUpdateDto),
            });

            if (!response.ok) {
                throw new Error('Failed to update medical record');
            }

            await fetchMedicalRecords();
            setIsEditModalOpen(false);
            setSelectedRecord(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/medical-records/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to delete medical record');
            }

            await fetchMedicalRecords();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleEditClick = (record: MedicalRecord) => {
        setSelectedRecord(record);
        setFormData({
            visitReason: record.visitReason,
            patientDescription: record.patientDescription,
            doctorNotes: record.doctorNotes || '',
            finalDiagnosis: record.finalDiagnosis || '',
            billingAmount: record.billingAmount || 0
        });
        setIsEditModalOpen(true);
    };

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (error) {
        return <Text color="red">{error}</Text>;
    }

    return (
        <Box p="md">
            <Group position="apart" mb="md">
                <Title order={2}>Medical Records</Title>
                <Button 
                    leftIcon={<IconPlus size={16} />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    New Record
                </Button>
            </Group>

            <Table>
                <thead>
                    <tr>
                        <th>Visit Reason</th>
                        <th>Created At</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {medicalRecords.map((record) => (
                        <tr key={record.id}>
                            <td>{record.visitReason}</td>
                            <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                            <td>
                                <Badge color={record.finalDiagnosis ? 'green' : 'yellow'}>
                                    {record.finalDiagnosis ? 'Completed' : 'In Progress'}
                                </Badge>
                            </td>
                            <td>
                                <Group spacing="xs">
                                    <ActionIcon 
                                        color="blue" 
                                        onClick={() => navigate(`/medical-records/${record.id}`)}
                                    >
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                    <ActionIcon 
                                        color="red" 
                                        onClick={() => handleDelete(record.id)}
                                    >
                                        <IconTrash size={16} />
                                    </ActionIcon>
                                </Group>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Create Modal */}
            <Modal
                opened={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Medical Record"
            >
                <Stack spacing="md">
                    <TextInput
                        label="Visit Reason"
                        value={formData.visitReason}
                        onChange={(e) => setFormData({ ...formData, visitReason: e.target.value })}
                        required
                    />
                    <Textarea
                        label="Patient Description"
                        value={formData.patientDescription}
                        onChange={(e) => setFormData({ ...formData, patientDescription: e.target.value })}
                        required
                    />
                    <Textarea
                        label="Doctor Notes"
                        value={formData.doctorNotes}
                        onChange={(e) => setFormData({ ...formData, doctorNotes: e.target.value })}
                    />
                    <Textarea
                        label="Final Diagnosis"
                        value={formData.finalDiagnosis}
                        onChange={(e) => setFormData({ ...formData, finalDiagnosis: e.target.value })}
                    />
                    <NumberInput
                        label="Billing Amount"
                        value={formData.billingAmount}
                        onChange={(value) => setFormData({ ...formData, billingAmount: value || 0 })}
                        precision={2}
                        min={0}
                    />
                    <Button onClick={handleCreate}>Create</Button>
                </Stack>
            </Modal>

            {/* Edit Modal */}
            <Modal
                opened={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Medical Record"
            >
                <Stack spacing="md">
                    <TextInput
                        label="Visit Reason"
                        value={formData.visitReason}
                        onChange={(e) => setFormData({ ...formData, visitReason: e.target.value })}
                        required
                    />
                    <Textarea
                        label="Patient Description"
                        value={formData.patientDescription}
                        onChange={(e) => setFormData({ ...formData, patientDescription: e.target.value })}
                        required
                    />
                    <Textarea
                        label="Doctor Notes"
                        value={formData.doctorNotes}
                        onChange={(e) => setFormData({ ...formData, doctorNotes: e.target.value })}
                    />
                    <Textarea
                        label="Final Diagnosis"
                        value={formData.finalDiagnosis}
                        onChange={(e) => setFormData({ ...formData, finalDiagnosis: e.target.value })}
                    />
                    <NumberInput
                        label="Billing Amount"
                        value={formData.billingAmount}
                        onChange={(value) => setFormData({ ...formData, billingAmount: value || 0 })}
                        precision={2}
                        min={0}
                    />
                    <Button onClick={handleUpdate}>Update</Button>
                </Stack>
            </Modal>
        </Box>
    );
} 