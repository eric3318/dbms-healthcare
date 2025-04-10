import { useEffect, useState } from 'react';
import { fetchAppointments, updateAppointment } from '../../../../../utils/data';
import useAuth from '../../../../../hooks/useAuth/useAuth';
import { Table, Button, Stack } from '@mantine/core';
import styles from './appointments.module.css';
import { format } from 'date-fns';
import { Slot } from '../../../../../lib/types';

const tableHeads = [
    {
        label: 'Date',
        value: 'date',
    },
    {
        label: 'Patient Name',
        value: 'patientName',
    },
    {
        label: 'Start Time',
        value: 'startTime',
    },
    {
        label: 'End Time',
        value: 'endTime',
    },
    {
        label: 'Status',
        value: 'status',
    },
    {
        label: 'Created at',
        value: 'createdAt',
    },
    {
        label: 'Updated at',
        value: 'updatedAt',
    },
    {
        label: 'Actions',
        value: 'actions',
    },
];

export default function Appointments() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Slot[]>([]);

    useEffect(() => {
        getAppointments();
    }, []);

    const getAppointments = async () => {
        const appointments = await fetchAppointments({
            // doctorId: user?.profile?.id,
        });
        setAppointments(appointments);
    };

    const handleEditAppointment = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        const success = await updateAppointment(id, {
            status,
        });

        if (success) {
            setAppointments((prev) => {
                return prev.map((appointment) => {
                    if (appointment.id === id) {
                        return { ...appointment, status: 'APPROVED' };
                    }
                    return appointment;
                });
            });
        }
    };

    return (
        <>
            <div className={styles.tableContainer}>
                <Table verticalSpacing="lg">
                    <Table.Thead>
                        <Table.Tr>
                            {tableHeads.map((head) => (
                                <Table.Th key={head.value}>{head.label}</Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {appointments.map((appointment) => (
                            <Table.Tr key={appointment.id}>
                                <Table.Td>{format(new Date(appointment.startTime), 'MMM dd, yyyy')}</Table.Td>
                                <Table.Td>{appointment.patient?.name}</Table.Td>
                                <Table.Td>{format(new Date(appointment.startTime), 'HH:mm')}</Table.Td>
                                <Table.Td>{format(new Date(appointment.endTime), 'HH:mm')}</Table.Td>
                                <Table.Td>{appointment.status}</Table.Td>
                                <Table.Td>{format(new Date(appointment.createdAt), 'yyyy-MM-dd HH:mm')}</Table.Td>
                                <Table.Td>{format(new Date(appointment.updatedAt), 'yyyy-MM-dd HH:mm')}</Table.Td>

                                {appointment.status === 'PENDING_APPROVAL' && (
                                    <>
                                        <Table.Td>
                                            <Stack>
                                                <Button
                                                    onClick={() => handleEditAppointment(appointment.id, 'APPROVED')}
                                                    size="xs"
                                                >
                                                    Approve
                                                </Button>

                                                <Button
                                                    onClick={() => handleEditAppointment(appointment.id, 'REJECTED')}
                                                    size="xs"
                                                >
                                                    Reject
                                                </Button>
                                            </Stack>
                                        </Table.Td>
                                    </>
                                )}

                                {appointment.status === 'APPROVED' && (
                                    <Table.Td>
                                        <Button
                                            size="xs"
                                            color="red"
                                            onClick={() => handleEditAppointment(appointment.id, 'CANCELLED')}
                                        >
                                            Cancel
                                        </Button>
                                    </Table.Td>
                                )}
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            </div>
        </>
    );
}
