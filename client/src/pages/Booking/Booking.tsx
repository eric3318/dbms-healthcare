import { createAppointment } from '../../utils/data';
import { useState, useEffect } from 'react';
import { Slot } from '../../lib/types';
import { useNavigate } from 'react-router';
import { fetchSlots } from '../../utils/data';
import SlotPicker from '../../components/SlotPicker/SlotPicker';
import styles from './booking.module.css';
import { Button, Text, Stack } from '@mantine/core';

export default function Booking() {
    const navigate = useNavigate();

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
            const slots = await fetchSlots();
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
