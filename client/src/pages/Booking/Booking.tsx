import { createAppointment } from '../../utils/data';
import { useState, useEffect } from 'react';
import { Slot } from '../../lib/types';
<<<<<<< HEAD
<<<<<<< HEAD
import { useNavigate } from 'react-router';
=======
import { useNavigate, useLocation } from 'react-router';
>>>>>>> temp-main
=======
import { useNavigate, useLocation } from 'react-router';
>>>>>>> temp-main
import { fetchSlots } from '../../utils/data';
import SlotPicker from '../../components/SlotPicker/SlotPicker';
import styles from './booking.module.css';
import { Button, Text, Stack } from '@mantine/core';

export default function Booking() {
<<<<<<< HEAD
<<<<<<< HEAD
    const navigate = useNavigate();
=======
    const { state } = useLocation();
    const { doctorId } = state;
>>>>>>> temp-main
=======
    const { state } = useLocation();
    const { doctorId } = state;
>>>>>>> temp-main

    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!selectedSlot) {
            return;
        }

        const createdAppointment = await createAppointment({
            slotId: selectedSlot,
        });

        if (createdAppointment) {
            console.log(createdAppointment);
        }
    };

    const handleSlotSelect = (slotId: string) => {
        setSelectedSlot(slotId);
    };

    useEffect(() => {
        async function getData() {
<<<<<<< HEAD
<<<<<<< HEAD
            const slots = await fetchSlots();
=======
            const slots = await fetchSlots({ doctorId });
>>>>>>> temp-main
=======
            const slots = await fetchSlots({ doctorId });
>>>>>>> temp-main
            setSlots(slots);
        }
        getData();
    }, []);

    return (
        <div className={styles.container}>
            <Text fw={500} size="xl">
                Dr. John Doe
            </Text>

            <SlotPicker items={slots} onSlotSelect={handleSlotSelect} />

            <div>
                <Button onClick={handleSubmit} size="lg" radius="md">
                    Confirm
                </Button>
            </div>
        </div>
    );
}
