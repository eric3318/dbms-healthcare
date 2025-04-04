import { useEffect, useState } from 'react';
import { 
  Doctor, 
  DoctorCreateDto, 
  DoctorUpdateDto, 
  getAllDoctors, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} from '../../utils/doctors';
import { Box, Button, Card, Container, Grid, Group, Modal, TextInput, Title, Text, LoadingOverlay } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<{ userId: string; name: string; specialization: string }>({
    userId: '',
    name: '',
    specialization: ''
  });

  // Fetch all doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Fetch doctors from API
  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllDoctors();
      if (data) {
        setDoctors(data);
      } else {
        setError('Failed to fetch doctors. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while fetching doctors.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle doctor creation
  const handleCreateDoctor = async () => {
    setLoading(true);
    try {
      const newDoctorData: DoctorCreateDto = {
        userId: formData.userId,
        name: formData.name,
        specialization: formData.specialization
      };
      
      const result = await createDoctor(newDoctorData);
      if (result) {
        setDoctors([...doctors, result]);
        closeCreateModal();
        setFormData({ userId: '', name: '', specialization: '' });
      } else {
        setError('Failed to create doctor. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while creating the doctor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle doctor edit
  const handleEditDoctor = async () => {
    if (!selectedDoctor?.id) return;
    
    setLoading(true);
    try {
      const updatedDoctorData: DoctorUpdateDto = {
        name: formData.name,
        specialization: formData.specialization
      };
      
      const result = await updateDoctor(selectedDoctor.id, updatedDoctorData);
      if (result) {
        setDoctors(doctors.map(doctor => 
          doctor.id === selectedDoctor.id ? result : doctor
        ));
        closeEditModal();
      } else {
        setError('Failed to update doctor. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while updating the doctor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle doctor deletion
  const handleDeleteDoctor = async () => {
    if (!selectedDoctor?.id) return;
    
    setLoading(true);
    try {
      const success = await deleteDoctor(selectedDoctor.id);
      if (success) {
        setDoctors(doctors.filter(doctor => doctor.id !== selectedDoctor.id));
        closeDeleteModal();
      } else {
        setError('Failed to delete doctor. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while deleting the doctor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal with doctor data
  const handleOpenEditModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      userId: doctor.userId || '',
      name: doctor.name || '',
      specialization: doctor.specialization || ''
    });
    openEditModal();
  };

  // Open delete modal with doctor data
  const handleOpenDeleteModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    openDeleteModal();
  };

  return (
    <Container size="lg" py="xl">
      <Box pos="relative">
        <LoadingOverlay visible={loading} />
        
        <Group justify="space-between" mb="lg">
          <Title order={2}>Doctors Management</Title>
          <Button onClick={openCreateModal} color="blue">Add New Doctor</Button>
        </Group>

        {error && (
          <Text c="red" mb="md">{error}</Text>
        )}

        <Grid>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <Grid.Col key={doctor.id} span={4}>
                <Card shadow="sm" p="lg" radius="md" withBorder>
                  <Card.Section p="md">
                    <Title order={4}>{doctor.name || 'Unnamed Doctor'}</Title>
                  </Card.Section>
                  
                  <Text size="sm" mb="xs"><b>Specialization:</b> {doctor.specialization}</Text>
                  <Text size="sm" mb="xs"><b>Doctor ID:</b> {doctor.id}</Text>
                  <Text size="sm" mb="xs"><b>User ID:</b> {doctor.userId}</Text>
                  <Text size="sm" mb="xs">
                    <b>Created:</b> {doctor.createdAt ? new Date(doctor.createdAt).toLocaleString() : 'N/A'}
                  </Text>
                  
                  <Group justify="flex-end" mt="md">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEditModal(doctor)}>
                      Edit
                    </Button>
                    <Button size="sm" color="red" onClick={() => handleOpenDeleteModal(doctor)}>
                      Delete
                    </Button>
                  </Group>
                </Card>
              </Grid.Col>
            ))
          ) : (
            !loading && <Text ta="center" my="xl">No doctors found. Add a new doctor to get started.</Text>
          )}
        </Grid>

        {/* Create Doctor Modal */}
        <Modal
          opened={createModalOpened}
          onClose={closeCreateModal}
          title="Add New Doctor"
          centered
        >
          <Box>
            <TextInput
              label="User ID"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              required
              mb="md"
            />
            <TextInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              mb="md"
            />
            <TextInput
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required
              mb="md"
            />
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={closeCreateModal}>Cancel</Button>
              <Button onClick={handleCreateDoctor}>Create</Button>
            </Group>
          </Box>
        </Modal>

        {/* Edit Doctor Modal */}
        <Modal
          opened={editModalOpened}
          onClose={closeEditModal}
          title="Edit Doctor"
          centered
        >
          <Box>
            <TextInput
              label="User ID"
              value={formData.userId}
              disabled
              mb="md"
            />
            <TextInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              mb="md"
            />
            <TextInput
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              required
              mb="md"
            />
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
              <Button onClick={handleEditDoctor}>Update</Button>
            </Group>
          </Box>
        </Modal>

        {/* Delete Doctor Modal */}
        <Modal
          opened={deleteModalOpened}
          onClose={closeDeleteModal}
          title="Delete Doctor"
          centered
        >
          <Box>
            <Text mb="md">
              Are you sure you want to delete the doctor "{selectedDoctor?.name || 'Unnamed Doctor'}" with ID: {selectedDoctor?.id}?
              This action cannot be undone.
            </Text>
            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={closeDeleteModal}>Cancel</Button>
              <Button color="red" onClick={handleDeleteDoctor}>Delete</Button>
            </Group>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
}
