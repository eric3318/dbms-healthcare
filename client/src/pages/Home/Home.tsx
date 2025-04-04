import { useState, useEffect } from 'react';
import { createAppointment, fetchSlots } from '../../utils/data';
import { Card, Title, Text, Button, Stack, Group } from '@mantine/core';
import { format } from 'date-fns';
import classes from './home.module.css';
import { useNavigate } from 'react-router';
import Topbar from '../../components/Topbar';
import { Slot } from '../../lib/types';

export default function Home() {
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
        <div className={classes.container}>
            <Topbar />
            <Title order={3}>Available Slots</Title>
            <Stack>
                {slots.map((slot) => (
                    <Card shadow="sm" p="xl" key={slot.id}>
                        <Group justify="space-between">
                            <Text>Start Time</Text>
                            <Text>{format(new Date(slot.startTime), 'yyyy-MM-dd HH:mm')}</Text>
                        </Group>

                        <Group justify="space-between">
                            <Text>End Time</Text>
                            <Text>{format(new Date(slot.endTime), 'yyyy-MM-dd HH:mm')}</Text>
                        </Group>
                        <Button onClick={() => handleNewAppointment(slot.id)}>Reserve</Button>
                    </Card>
                ))}
            </Stack>
        </div>
    );
}
