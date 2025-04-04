import React, { useState, useEffect } from 'react';
import { Box, Title, Text, Button, Card, Group, Stack } from '@mantine/core';
import { components } from '../../types/api';

type Patient = components['schemas']['Patient'];

export default function PatientPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/patients');
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      const data = await response.json();
      setPatients(data);
      setError('');
    } catch (err) {
      setError('Error loading patient data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Loading patient data...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <Box p="md">
      <Title order={2} mb="lg">Patient List</Title>
      
      <Stack>
        {patients.length === 0 ? (
          <Text>No patient data available</Text>
        ) : (
          patients.map(patient => (
            <Card shadow="sm" p="xl" key={patient.id}>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text>Personal Health Number</Text>
                  <Text>{patient.personalHealthNumber}</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text>Address</Text>
                  <Text>{patient.address}</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text>User ID</Text>
                  <Text>{patient.userId}</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text>Doctor ID</Text>
                  <Text>{patient.doctorId || 'Not assigned'}</Text>
                </Group>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
      
      <Button mt="md" onClick={fetchPatients}>Refresh Data</Button>
    </Box>
  );
}