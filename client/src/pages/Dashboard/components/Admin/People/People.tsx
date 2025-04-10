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
    // Doctors state
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [doctorModalOpen, setDoctorModalOpen] = useState(false);
    const [isCreateDoctor, setIsCreateDoctor] = useState(false);
    const [doctorFormData, setDoctorFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        specialization: ''
    });

    // Patients state
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [patientModalOpen, setPatientModalOpen] = useState(false);
    const [isCreatePatient, setIsCreatePatient] = useState(false);
    const [patientFormData, setPatientFormData] = useState({
        personalHealthNumber: '',
        address: '',
        userId: '',
        doctorId: ''
    });

    useEffect(() => {
        fetchDoctors();
        fetchPatients();
    }, []);

    // Doctors functions
    const fetchDoctors = async () => {
        try {
            const data = await getAllDoctors();
            setDoctors(data || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleCreateDoctor = () => {
        setIsCreateDoctor(true);
        setDoctorFormData({
            name: '',
            email: '',
            phoneNumber: '',
            specialization: ''
        });
        setDoctorModalOpen(true);
    };

    const handleEditDoctor = (doctor: Doctor) => {
        setIsCreateDoctor(false);
        setSelectedDoctor(doctor);
        setDoctorFormData({
            name: doctor.name || '',
            email: doctor.email || '',
            phoneNumber: doctor.phoneNumber || '',
            specialization: doctor.specialization || ''
        });
        setDoctorModalOpen(true);
    };

    const handleDeleteDoctor = async (doctorId: string | undefined) => {
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

    const handleSubmitDoctor = async () => {
        try {
            if (isCreateDoctor) {
                await createDoctor(doctorFormData);
            } else if (selectedDoctor?.id) {
                await updateDoctor(selectedDoctor.id, doctorFormData);
            }
            setDoctorModalOpen(false);
            fetchDoctors();
        } catch (error) {
            console.error('Error saving doctor:', error);
        }
    };

    // Patients functions
    const fetchPatients = async () => {
        try {
            const data = await getAllPatients();
            setPatients(data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleCreatePatient = () => {
        setIsCreatePatient(true);
        setPatientFormData({
            personalHealthNumber: '',
            address: '',
            userId: '',
            doctorId: ''
        });
        setPatientModalOpen(true);
    };

    const handleEditPatient = (patient: Patient) => {
        setIsCreatePatient(false);
        setSelectedPatient(patient);
        setPatientFormData({
            personalHealthNumber: patient.personalHealthNumber || '',
            address: patient.address || '',
            userId: patient.userId || '',
            doctorId: patient.doctorId || ''
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

    // Doctors rows
    const doctorRows = doctors.map((doctor) => (
        <Table.Tr key={doctor.id}>
            <Table.Td>{doctor.name}</Table.Td>
            <Table.Td>{doctor.email}</Table.Td>
            <Table.Td>{doctor.phoneNumber}</Table.Td>
            <Table.Td>{doctor.specialization}</Table.Td>
            <Table.Td>
                <Group>
                    <Button 
                        variant="subtle" 
                        leftSection={<IconEdit size={14} />}
                        onClick={() => handleEditDoctor(doctor)}
                    >
                        Edit
                    </Button>
                    <Button 
                        variant="subtle" 
                        color="red" 
                        leftSection={<IconTrash size={14} />}
                        onClick={() => handleDeleteDoctor(doctor.id)}
                    >
                        Delete
                    </Button>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    // Patients rows
    const patientRows = patients.map((patient) => (
        <Table.Tr key={patient.id}>
            <Table.Td>{patient.personalHealthNumber}</Table.Td>
            <Table.Td>{patient.userId}</Table.Td>
            <Table.Td>{patient.address}</Table.Td>
            <Table.Td>{patient.doctorId}</Table.Td>
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
                    <Button 
                        leftSection={<IconPlus size={14} />}
                        onClick={handleCreateDoctor}
                        mb="md"
                    >
                        Create Doctor
                    </Button>
                    
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Email</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th>Specialization</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {doctorRows}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>

                <Tabs.Panel value={tabs[1].value}>
                    <Button 
                        leftSection={<IconPlus size={14} />}
                        onClick={handleCreatePatient}
                        mb="md"
                    >
                        Create Patient
                    </Button>
                    
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Personal Health No.</Table.Th>
                                <Table.Th>User ID</Table.Th>
                                <Table.Th>Address</Table.Th>
                                <Table.Th>Doctor ID</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {patientRows}
                        </Table.Tbody>
                    </Table>
                </Tabs.Panel>
            </Tabs>

            {/* Doctor Modal */}
            <Modal 
                opened={doctorModalOpen} 
                onClose={() => setDoctorModalOpen(false)}
                title={isCreateDoctor ? "Create Doctor" : "Edit Doctor"}
            >
                <TextInput
                    label="Name"
                    value={doctorFormData.name}
                    onChange={(e) => setDoctorFormData({...doctorFormData, name: e.target.value})}
                    mb="md"
                />
                <TextInput
                    label="Email"
                    value={doctorFormData.email}
                    onChange={(e) => setDoctorFormData({...doctorFormData, email: e.target.value})}
                    mb="md"
                />
                <TextInput
                    label="Phone Number"
                    value={doctorFormData.phoneNumber}
                    onChange={(e) => setDoctorFormData({...doctorFormData, phoneNumber: e.target.value})}
                    mb="md"
                />
                <TextInput
                    label="Specialization"
                    value={doctorFormData.specialization}
                    onChange={(e) => setDoctorFormData({...doctorFormData, specialization: e.target.value})}
                    mb="md"
                />
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => setDoctorModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitDoctor}>
                        {isCreateDoctor ? "Create" : "Save"}
                    </Button>
                </Group>
            </Modal>

            {/* Patient Modal */}
            <Modal 
                opened={patientModalOpen} 
                onClose={() => setPatientModalOpen(false)}
                title={isCreatePatient ? "Create Patient" : "Edit Patient"}
            >
                <TextInput
                    label="Personal Health Number"
                    value={patientFormData.personalHealthNumber}
                    onChange={(e) => setPatientFormData({...patientFormData, personalHealthNumber: e.target.value})}
                    mb="md"
                />
                <TextInput
                    label="Address"
                    value={patientFormData.address}
                    onChange={(e) => setPatientFormData({...patientFormData, address: e.target.value})}
                    mb="md"
                />
                <TextInput
                    label="User ID"
                    value={patientFormData.userId}
                    onChange={(e) => setPatientFormData({...patientFormData, userId: e.target.value})}
                    mb="md"
                />
                <TextInput
                    label="Doctor ID"
                    value={patientFormData.doctorId}
                    onChange={(e) => setPatientFormData({...patientFormData, doctorId: e.target.value})}
                    mb="md"
                />
                <Group justify="flex-end" mt="md">
                    <Button variant="default" onClick={() => setPatientModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitPatient}>
                        {isCreatePatient ? "Create" : "Save"}
                    </Button>
                </Group>
            </Modal>
        </>
    );
}
