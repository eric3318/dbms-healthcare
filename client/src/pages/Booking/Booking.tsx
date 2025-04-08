import { Button, Group, Card, Title, Stack, Text } from '@mantine/core';
import { format } from 'date-fns';
import { createAppointment } from '../../utils/data';
import { useState, useEffect } from 'react';
import { Slot } from '../../lib/types';
import { useNavigate } from 'react-router';
import { fetchSlots } from '../../utils/data';

export default function Booking() {
    const navigate = useNavigate();

    const [slots, setSlots] = useState<Slot[]>([]);

    const handleNewAppointment = async (slotId: string) => {
        const createdAppointment = await createAppointment({
            slotId,
            patientId: '1',
        });

        if (createdAppointment) {
            navigate('/profile');
        }
    };

    useEffect(() => {
        async function getData() {
            const slots = await fetchSlots();
            if (slots) {
                setSlots(slots);
            }
        }
        getData();
    }, []);

    return (
        <div>
            <Title order={3}>Available Slots</Title>
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
                        <Button onClick={() => slot.id && handleNewAppointment(slot.id)}>Reserve</Button>
                    </Card>
                ))}
            </Stack>
        </div>
    );
}
