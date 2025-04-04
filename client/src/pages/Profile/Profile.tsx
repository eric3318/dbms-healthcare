import { useEffect, useState } from 'react';
import { fetchAppointments } from '../../utils/data';
import { Slot } from '../../lib/types';
import { Button, Card, Group, Title, Text, Stack } from '@mantine/core';
import { format } from 'date-fns';
import { cancelAppointment } from '../../utils/data';

export default function Profile() {
    const [appointments, setAppointments] = useState<Slot[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);

    const getAppointments = async () => {
        const appointments = await fetchAppointments({});
        if (appointments) {
            setAppointments(appointments);
        }
    };

    useEffect(() => {
        getAppointments();
    }, [refreshKey]);

    const handleCancelAppointment = async (appointmentId: string) => {
        await cancelAppointment(appointmentId);
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div>
            <Title order={3}>My Appointments</Title>
            <Stack>
                {appointments.map((appointment) => (
                    <Card shadow="sm" p="xl" key={appointment.id}>
                        <Stack gap="xs">
                            <Group justify="space-between">
                                <Text>Doctor</Text>
                                <Text>{appointment.doctorId}</Text>
                            </Group>

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
                                <Text>{appointment.status}</Text>
                            </Group>

                            <Button
                                variant="subtle"
                                color="red"
                                onClick={() => handleCancelAppointment(appointment.id)}
                            >
                                Cancel Appointment
                            </Button>
                        </Stack>
                    </Card>
                ))}
            </Stack>
        </div>
    );
}
