import { useState, useEffect } from 'react';
import { Tabs, Table, Button, Modal, TextInput, Group, Text } from '@mantine/core';
import { IconPhoto, IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { Doctor, getAllDoctors, deleteDoctor, updateDoctor, createDoctor } from '../../../../../utils/doctors';
import { Patient, getAllPatients, deletePatient, updatePatient, createPatient } from '../../../../../utils/patients';

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
    // Doctor state
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

    // Patient state
    const [patients, setPatients] = useState<Patient[]>([]);
    const [patientLoading, setPatientLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patientModalOpen, setPatientModalOpen] = useState(false);
    const [isCreatePatient, setIsCreatePatient] = useState(false);
    const [patientFormData, setPatientFormData] = useState({
        name: '',
        personalHealthNumber: '',
        address: ''
    });

    useEffect(() => {
        fetchDoctors();
        fetchPatients();
    }, []);

    // Doctor functions
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

    // Patient functions
    const fetchPatients = async () => {
        try {
            const data = await getAllPatients();
            setPatients(data || []);
            setPatientLoading(false);
        } catch (error) {
            console.error('Error fetching patients:', error);
            setPatientLoading(false);
        }
    };

    const handleCreatePatient = () => {
        setIsCreatePatient(true);
        setPatientFormData({
            name: '',
            personalHealthNumber: '',
            address: ''
        });
        setPatientModalOpen(true);
    };

    const handleEditPatient = (patient: Patient) => {
        setIsCreatePatient(false);
        setSelectedPatient(patient);
        setPatientFormData({
            name: patient.name || '',
            personalHealthNumber: patient.personalHealthNumber || '',
            address: patient.address || '',
        });
        setPatientModalOpen(true);
    };

    const handleDeletePatient = async (patientId: string | undefined) => {
        if (!patientId) return;
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await deletePatient(patientId);
                fetchPatients();
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    const handleSubmitPatient = async () => {
        try {
            if (isCreatePatient) {
                await createPatient(patientFormData);
            } else if (selectedPatient?.id) {
                await updatePatient(selectedPatient.id, patientFormData);
            }
            setPatientModalOpen(false);
            fetchPatients();
        } catch (error) {
            console.error('Error saving patient:', error);
        }
    };

    // Doctor rows
    const rows = doctors.map((doctor) => (
        <Table.Tr key={doctor.id}>
            {/* <Table.Td>{doctor.userId}</Table.Td> */}
            <Table.Td>{doctor.name}</Table.Td>
            <Table.Td>{doctor.email}</Table.Td>
            <Table.Td>{doctor.phoneNumber}</Table.Td>
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

    // Patient rows
    const patientRows = patients.map((patient) => (
        <Table.Tr key={patient.id}>
            <Table.Td>{patient.name}</Table.Td>
            <Table.Td>{patient.personalHealthNumber}</Table.Td>
            <Table.Td>{patient.address}</Table.Td>
            <Table.Td>
                <Group>
                    <Button 
                        variant="subtle" 
                        leftSection={<IconEdit size={14} />} 
                        onClick={() => handleEditPatient(patient)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="subtle"
                        color="red"
                        leftSection={<IconTrash size={14} />}
                        onClick={() => handleDeletePatient(patient.id)}
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
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th>Specialization</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Tabs.Panel>

                <Tabs.Panel value={tabs[1].value}>
                    <Button leftSection={<IconPlus size={14} />} onClick={handleCreatePatient} mb="md">
                        Create Patient
                    </Button>

                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Personal Health No.</Table.Th>
                                <Table.Th>Address</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{patientRows}</Table.Tbody>
                    </Table>
                </Tabs.Panel>
            </Tabs>

            {/* Doctor modal form */}
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

            {/* Patient modal form */}
            <Modal
                opened={patientModalOpen}
                onClose={() => setPatientModalOpen(false)}
                title={isCreatePatient ? "Create Patient" : "Edit Patient"}
            >
                <TextInput
                    label="Name"
                    value={patientFormData.name}
                    onChange={(e) => setPatientFormData({ ...patientFormData, name: e.target.value })}
                    mb="md"
                />
                <TextInput
                    label="Personal Health Number"
                    value={patientFormData.personalHealthNumber}
                    onChange={(e) => setPatientFormData({ ...patientFormData, personalHealthNumber: e.target.value })}
                    mb="md"
                />
                <TextInput
                    label="Address"
                    value={patientFormData.address}
                    onChange={(e) => setPatientFormData({ ...patientFormData, address: e.target.value })}
                    mb="md"
                />
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => setPatientModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitPatient}>{isCreatePatient ? "Create" : "Save"}</Button>
                </Group>
            </Modal>
        </>
    );
}
