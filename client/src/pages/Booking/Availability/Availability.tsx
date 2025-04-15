import { createAppointment } from '../../../utils/data';
import { useState, useEffect } from 'react';
import { Slot } from '../../../lib/types';
import { useNavigate, useLocation, useParams } from 'react-router';
import { fetchSlots } from '../../../utils/data';
import SlotPicker from '../../../components/SlotPicker/SlotPicker';
import styles from './availability.module.css';
import { Button, Text, Stack, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
export default function Availability() {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const doctor = location.state?.doctor;

    if (!doctor) {
        navigate('/booking');
    }

    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [visitReason, setVisitReason] = useState<string>('');

    const handleSubmit = async () => {
        if (!selectedSlot) {
            return;
        }

        const createdAppointment = await createAppointment({
            slotId: selectedSlot,
            visitReason,
        });

        if (createdAppointment) {
            notifications.show({
                title: 'Success',
                message: 'Appointment booked successfully',
                color: 'green',
            });
            navigate('/dashboard');
            return;
        }

        notifications.show({
            title: 'Error',
            message: 'Failed to book appointment. Please try again.',
            color: 'red',
        });
    };

    const handleSlotSelect = (slotId: string) => {
        setSelectedSlot(slotId);
    };

    useEffect(() => {
        async function getData() {
            const slots = await fetchSlots({ doctorId });
            setSlots(slots);
        }
        getData();
    }, []);

    return (
        <div className={styles.container}>
            <Text fw={500} size="xl">
                {doctor.name}
            </Text>

            <SlotPicker items={slots} onSelect={handleSlotSelect} />

            {selectedSlot && (
                <>
                    <Textarea
                        label="Visit Reason"
                        size="lg"
                        placeholder="Enter your visit reason"
                        value={visitReason}
                        onChange={(e) => setVisitReason(e.target.value)}
                    />

                    <Button onClick={handleSubmit} size="lg" radius="md">
                        Confirm
                    </Button>
                </>
            )}
        </div>
    );
}
