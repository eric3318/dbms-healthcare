import React, { useState, useEffect } from 'react';
import { Box, Title, Text, Button, Card, Group, Stack } from '@mantine/core';
import { components } from '../../types/api'; // from the generated file

// use the generated types
type Requisition = components['schemas']['Requisition'];

export default function RequisitionPage() {
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequisitions();
  }, []);

  const fetchRequisitions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/requisitions');
      if (!response.ok) {
        throw new Error('Failed to fetch requisitions');
      }
      const data = await response.json();
      setRequisitions(data);
      setError('');
    } catch (err) {
      setError('Error loading requisition data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Loading requisition data...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  return (
    <Box p="md">
      <Title order={2} mb="lg">Requisition List</Title>
      
      <Stack>
        {requisitions.length === 0 ? (
          <Text>No requisition data available</Text>
        ) : (
          requisitions.map(requisition => (
            <Card shadow="sm" p="xl" key={requisition.id}>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text>ID</Text>
                  <Text>{requisition.id}</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text>Medical Record ID</Text>
                  <Text>{requisition.medicalRecordId}</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text>Test Name</Text>
                  <Text>{requisition.testName}</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text>Status</Text>
                  <Text>{requisition.status}</Text>
                </Group>
                
                <Group justify="space-between">
                  <Text>Result</Text>
                  <Text>{requisition.result ? 
                    `${requisition.result.conclusion}` : 
                    'No result available'}
                  </Text>
                </Group>
                
                <Group justify="space-between">
                  <Text>Requested At</Text>
                  <Text>{requisition.requestedAt ? 
                    new Date(requisition.requestedAt).toLocaleDateString() : 
                    'Unknown date'}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
      
      <Button mt="md" onClick={fetchRequisitions}>Refresh Data</Button>
    </Box>
  );
}