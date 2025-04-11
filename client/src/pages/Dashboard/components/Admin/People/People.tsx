import { useState, useEffect } from 'react';
import { Tabs, Table, Button, Modal, TextInput, Group, Text } from '@mantine/core';
import { IconPhoto, IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { Doctor, getAllDoctors, deleteDoctor, updateDoctor, createDoctor } from '../../../../../utils/doctors';

const tabs = [
    {
        label: 'Doctors',
        value: 'doctors',
    },
    {
        label: 'Patients',
        value: 'patients',
    },
];

export default function People() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        // email: '',
        // phoneNumber: '',
        licenseNumber: '',
        specialization: '',
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const data = await getAllDoctors();
            setDoctors(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setIsCreate(true);
        setFormData({
            name: '',
            // email: '',
            // phoneNumber: '',
            licenseNumber: '',
            specialization: '',
        });
        setModalOpen(true);
    };

    const handleEdit = (doctor: Doctor) => {
        setIsCreate(false);
        setSelectedDoctor(doctor);
        setFormData({
            name: doctor.name || '',
            // email: doctor.email || '',
            // phoneNumber: doctor.phoneNumber || '',
            licenseNumber: doctor.licenseNumber || '',
            specialization: doctor.specialization || '',
        });
        setModalOpen(true);
    };

    const handleDelete = async (doctorId: string | undefined) => {
        if (!doctorId) return;
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await deleteDoctor(doctorId);
                fetchDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            if (isCreate) {
                await createDoctor(formData);
            } else if (selectedDoctor?.id) {
                await updateDoctor(selectedDoctor.id, formData);
            }
            setModalOpen(false);
            fetchDoctors();
        } catch (error) {
            console.error('Error saving doctor:', error);
        }
    };

    const rows = doctors.map((doctor) => (
        <Table.Tr key={doctor.id}>
            {/* <Table.Td>{doctor.userId}</Table.Td> */}
            <Table.Td>{doctor.name}</Table.Td>
            <Table.Td>{doctor.licenseNumber}</Table.Td>
            {/* <Table.Td>{doctor.email}</Table.Td>
            <Table.Td>{doctor.phoneNumber}</Table.Td> */}
            <Table.Td>{doctor.specialization}</Table.Td>
            <Table.Td>
                <Group>
                    <Button variant="subtle" leftSection={<IconEdit size={14} />} onClick={() => handleEdit(doctor)}>
                        Edit
                    </Button>
                    <Button
                        variant="subtle"
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => handleDelete(doctor.id)}
                    >
                        Delete
                    </Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Tabs defaultValue={tabs[0].value}>
                <Tabs.List>
                    {tabs.map((tab) => (
                        <Tabs.Tab key={tab.value} value={tab.value} leftSection={<IconPhoto size={12} />}>
                            {tab.label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                <Tabs.Panel value={tabs[0].value}>
                    <Button leftSection={<IconPlus size={14} />} onClick={handleCreate} mb="md">
                        Create Doctor
                    </Button>

                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                {/* <Table.Th>User ID</Table.Th> */}
                                <Table.Th>Name</Table.Th>
                                {/* <Table.Th>Email</Table.Th>
                                <Table.Th>Phone</Table.Th> */}
                                <Table.Th>License Number</Table.Th>
                                <Table.Th>Specialization</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Tabs.Panel>

                <Tabs.Panel value={tabs[1].value}>
                    <Text>Patients content coming soon</Text>
                </Tabs.Panel>
            </Tabs>

            <Modal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                title={isCreate ? 'Create Doctor' : 'Edit Doctor'}
            >
                <TextInput
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    mb="md"
                />
                <TextInput
                    label="License Number"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    mb="md"
                />
                {/* <TextInput
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    mb="md"
                /> */}
                <TextInput
                    label="Specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    mb="md"
                />
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => setModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>{isCreate ? 'Create' : 'Save'}</Button>
                </Group>
            </Modal>
        </>
    );
}
