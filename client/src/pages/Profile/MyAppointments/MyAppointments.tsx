import { Card, Stack, Group, Text, Button } from '@mantine/core';
import { format } from 'date-fns';
import { fetchAppointments } from '../../../utils/data';
import { useEffect, useState } from 'react';
import { cancelAppointment } from '../../../utils/data';
import { Slot } from '../../../lib/types';
import { Badge } from '@mantine/core';

export default function MyAppointments() {
    const [appointments, setAppointments] = useState<Slot[]>([]);

    useEffect(() => {
        getAppointments();
    }, []);

    const getAppointments = async () => {
        const appointments = await fetchAppointments({});
        setAppointments(appointments);
    };

    const handleCancelAppointment = async (appointmentId: string) => {
        const success = await cancelAppointment(appointmentId);
        if (success) {
            setAppointments((prev) =>
                prev.map((appointment) =>
                    appointment.id === appointmentId ? { ...appointment, status: 'CANCELLED' } : appointment,
                ),
            );
        }
    };

    return (
        <div>
            <Group>
                {appointments.map((appointment) => (
                    <Card shadow="sm" p="xl" key={appointment.id}>
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text>Start Time</Text>
                                <Text>{format(new Date(appointment.startTime), 'yyyy-MM-dd HH:mm')}</Text>
                            </Group>

                            <Group justify="space-between">
                                <Text>End Time</Text>
                                <Text>{format(new Date(appointment.endTime), 'yyyy-MM-dd HH:mm')}</Text>
                            </Group>

                            <Group justify="space-between">
                                <Text>Status</Text>

                                <Badge
                                    size="lg"
                                    variant="transparent"
                                    color={
                                        appointment.status === 'CANCELLED' || appointment.status === 'REJECTED'
                                            ? 'red'
                                            : appointment.status === 'APPROVED'
                                              ? 'green'
                                              : appointment.status === 'PENDING_APPROVAL'
                                                ? 'yellow'
                                                : 'gray'
                                    }
                                    p={0}
                                >
                                    {appointment.status}
                                </Badge>
                            </Group>

                            <Button variant="light">Edit details</Button>
                        </Stack>
                    </Card>
                ))}
            </Group>
        </div>
    );
}
