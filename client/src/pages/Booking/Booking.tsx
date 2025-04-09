import { Button, Group, Card, Title, Stack, Text } from '@mantine/core';
import { format } from 'date-fns';
import { createAppointment } from '../../utils/data';
import { useState, useEffect } from 'react';
import { Slot } from '../../lib/types';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSlots } from '../../utils/data';

export default function SlotBooking() {
    const navigate = useNavigate();
    const { doctorId } = useParams<{ doctorId: string }>();
    
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [doctorName, setDoctorName] = useState<string>('');

    const handleNewAppointment = async (slotId: string) => {
        try {
            const createdAppointment = await createAppointment({
                slotId,
                patientId: '1' // You might want to get this from user context/authentication
                // doctorId is not needed here because the slot already has doctorId
            });

            if (createdAppointment) {
                navigate('/profile');
            }
        } catch (err) {
            setError('Failed to create appointment. Please try again.');
            console.error('Error creating appointment:', err);
        }
    };

    useEffect(() => {
        async function getData() {
            if (!doctorId) {
                setError('Doctor ID is missing. Please select a doctor first.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Modify fetchSlots to filter by doctorId
                const slots = await fetchSlots();
                // Filter slots by doctorId if fetchSlots doesn't support filtering
                const filteredSlots = slots ? slots.filter(slot => slot.doctorId === doctorId) : [];
                
                if (filteredSlots && filteredSlots.length > 0) {
                    setSlots(filteredSlots);
                    
                    // If your slot data includes doctor name, you could set it here
                    // For example, if slots[0].doctorName exists:
                    // setDoctorName(slots[0].doctorName);
                } else {
                    setSlots([]);
                }
                
                setLoading(false);
            } catch (err) {
                setError('Failed to load available slots. Please try again later.');
                setLoading(false);
                console.error('Error fetching slots:', err);
            }
        }
        getData();
    }, [doctorId]);

    if (loading) {
        return <div>Loading available slots...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="slot-booking-container">
            <Title order={3}>Book an Appointment {doctorName && `with ${doctorName}`}</Title>
            
            {slots.length === 0 ? (
                <Text>No available slots found for this doctor.</Text>
            ) : (
                <Stack>
                    {slots.map((slot) => (
                        <Card shadow="sm" p="xl" key={slot.id} className="slot-card">
                            <Group justify="space-between">
                                <Text>Start Time</Text>
                                <Text>{slot.startTime ? format(new Date(slot.startTime), 'yyyy-MM-dd HH:mm') : 'N/A'}</Text>
                            </Group>

                            <Group justify="space-between">
                                <Text>End Time</Text>
                                <Text>{slot.endTime ? format(new Date(slot.endTime), 'yyyy-MM-dd HH:mm') : 'N/A'}</Text>
                            </Group>
                            
                            <Button 
                                onClick={() => slot.id && handleNewAppointment(slot.id)}
                                className="reserve-button"
                                fullWidth
                                mt="md"
                            >
                                Reserve
                            </Button>
                        </Card>
                    ))}
                </Stack>
            )}
        </div>
    );
}