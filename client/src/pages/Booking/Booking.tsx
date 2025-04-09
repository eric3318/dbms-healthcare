import { Button, Group, Card, Title, Stack, Text } from '@mantine/core';
import { format } from 'date-fns';
import { createAppointment } from '../../utils/data';
import { useState, useEffect } from 'react';
import { Slot } from '../../lib/types';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSlotsByDoctorUserId } from '../../utils/data';

export default function Booking() {
    const navigate = useNavigate();
    const { doctorId } = useParams<{ doctorId: string }>();
    
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string[]>([]);
    const [apiUrl, setApiUrl] = useState<string>('');

    const addDebugInfo = (message: string) => {
        setDebugInfo(prev => [...prev, message]);
    };

    const handleNewAppointment = async (slotId: string) => {
        try {
            const createdAppointment = await createAppointment({
                slotId,
                patientId: '1',
            });

            if (createdAppointment) {
                navigate('/profile');
            }
        } catch (err) {
            setError('Failed to create appointment');
            console.error(err);
        }
    };

    useEffect(() => {
        async function getData() {
            if (!doctorId) {
                addDebugInfo("No doctorId provided in URL parameters");
                setError('Doctor ID is missing');
                setLoading(false);
                return;
            }

            // Capture the API URL for debugging
            const url = `/api/slots/doctor/${doctorId}`;
            setApiUrl(url);
            
            addDebugInfo(`Fetching slots from URL: ${url}`);
            addDebugInfo(`Fetching slots for doctorId: ${doctorId}`);
            setLoading(true);
            
            try {
                // Fetch slots directly by doctor ID using the API endpoint
                const doctorSlots = await fetchSlotsByDoctorUserId(doctorId);
                
                if (doctorSlots && doctorSlots.length > 0) {
                    addDebugInfo(`Slots fetched successfully. Count: ${doctorSlots.length}`);
                    // Add more detailed logging for debugging
                    addDebugInfo(`First slot: ${JSON.stringify(doctorSlots[0])}`);
                    setSlots(doctorSlots);
                } else {
                    addDebugInfo("No slots returned from API or empty array received");
                    setSlots([]);
                }
                
                setLoading(false);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                addDebugInfo(`Error fetching slots: ${errorMessage}`);
                setError('Failed to load slots');
                setLoading(false);
            }
        }
        
        getData();
    }, [doctorId]);

    return (
        <div>
            <Title order={3}>Available Slots for Doctor</Title>
            
            {/* Debug Information */}
            <div style={{ 
                background: '#f5f5f5', 
                padding: '10px', 
                margin: '10px 0', 
                borderRadius: '4px',
                maxHeight: '200px',
                overflowY: 'auto'
            }}>
                <Text>Debug Info:</Text>
                <Text size="sm">Doctor ID: {doctorId || 'Not provided'}</Text>
                <Text size="sm" color="blue">API URL: {apiUrl}</Text>
                <Text size="sm">Loading: {loading ? 'Yes' : 'No'}</Text>
                <Text size="sm">Slots count: {slots.length}</Text>
                <Text size="sm">Log Messages:</Text>
                {debugInfo.map((info, index) => (
                    <Text key={index} size="sm">{info}</Text>
                ))}
            </div>
            
            {!loading && slots.length === 0 ? (
                <Text>No available slots found for this doctor.</Text>
            ) : (
                <Stack>
                    {slots.map((slot) => (
                        <Card shadow="sm" p="xl" key={slot.id}>
                            <Group justify="space-between">
                                <Text>Start Time</Text>
                                <Text>{slot.startTime ? format(new Date(slot.startTime), 'yyyy-MM-dd HH:mm') : 'N/A'}</Text>
                            </Group>

                            <Group justify="space-between">
                                <Text>End Time</Text>
                                <Text>{slot.endTime ? format(new Date(slot.endTime), 'yyyy-MM-dd HH:mm') : 'N/A'}</Text>
                            </Group>
                            <Group justify="space-between" mt="md">
                                <Text>Status: {slot.status}</Text>
                                <Button onClick={() => slot.id && handleNewAppointment(slot.id)}>Reserve</Button>
                            </Group>
                        </Card>
                    ))}
                </Stack>
            )}
        </div>
    );
}3.20