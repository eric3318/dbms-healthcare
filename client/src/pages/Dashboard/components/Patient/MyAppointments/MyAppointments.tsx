import { Card, Stack, Group, Text, Button } from '@mantine/core';
import { format } from 'date-fns';
import { fetchAppointments } from '../../../../../utils/data';
import { useEffect, useState } from 'react';
import { cancelAppointment } from '../../../../../utils/data';
import { Appointment } from '../../../../../lib/types';
import { Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import useAuth from '../../../../../hooks/useAuth/useAuth';
import AppointmentEditModal from '../../../../../components/AppointmentEditModal/AppointmentEditModal';

export default function MyAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        getAppointments();
    }, []);

    const getAppointments = async () => {
        const appointments = await fetchAppointments({
            patientId: user?.profile?.role_id,
        });
        setAppointments(appointments);
    };

    const handleCancelAppointment = async (id: string) => {
        const success = await cancelAppointment(id);

        if (success) {
            setAppointments((prev) =>
                prev.map((appointment) =>
                    appointment.id === id ? { ...appointment, status: 'CANCELLED' } : appointment,
                ),
            );
        }
    };

    const handleAppointmentSelect = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        open();
    };

    return (
        <Group>
            {appointments.map((appointment) => (
                <Card shadow="sm" p="xl" key={appointment.id} w={300}>
                    <Stack gap="md">
                        <Group justify="space-between">
                            <Text>Doctor</Text>
                            <Text>{appointment.doctorName}</Text>
                        </Group>

                        <Group justify="space-between">
                            <Text>Date</Text>
                            <Text>{format(new Date(appointment.slot?.startTime as string), 'MMM dd, yyyy')}</Text>
                        </Group>

                        <Group justify="space-between">
                            <Text>Start Time</Text>
                            <Text>{format(new Date(appointment.slot?.startTime as string), 'HH:mm')}</Text>
                        </Group>

                        <Group justify="space-between">
                            <Text>End Time</Text>
                            <Text>{format(new Date(appointment.slot?.endTime as string), 'HH:mm')}</Text>
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

                        <Button
                            variant="light"
                            onClick={() => handleAppointmentSelect(appointment)}
                            disabled={appointment.status !== 'PENDING_APPROVAL'}
                        >
                            Edit
                        </Button>

                        <Button
                            variant="light"
                            color="red"
                            disabled={appointment.status === 'CANCELLED' || appointment.status === 'REJECTED'}
                            onClick={() => handleCancelAppointment(appointment.id as string)}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Card>
            ))}

            {selectedAppointment && <AppointmentEditModal opened={opened} onClose={close} item={selectedAppointment} />}
        </Group>
    );
}
