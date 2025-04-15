import { createAppointment } from '../../utils/data';
import { useState, useEffect } from 'react';
import { Slot } from '../../lib/types';
import { useNavigate, useLocation } from 'react-router';
import { fetchSlots } from '../../utils/data';
import SlotPicker from '../../components/SlotPicker/SlotPicker';
import styles from './booking.module.css';
import { Button, Text, Modal } from '@mantine/core';

export default function Booking() {
    const { state } = useLocation();
    const { doctor } = state;
    const doctorId = doctor._id || doctor.id;


    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [modalOpened, setModalOpened] = useState(false);

    const handleSubmit = async () => {
        if (!selectedSlot) {
            return;
        }

        const createdAppointment = await createAppointment({
            slotId: selectedSlot,
        });

        if (createdAppointment) {
            console.log(createdAppointment);
            setModalOpened(true);
        }
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

            <SlotPicker items={slots} onSlotSelect={handleSlotSelect} />

            <div>
                <Button onClick={handleSubmit} size="lg" radius="md">
                    Confirm
                </Button>
            </div>

            <Modal
              opened={modalOpened}
              onClose={() => setModalOpened(false)}
              title="Appointment Submitted"
              centered
            >
            </Modal>
        </div>
    );
}
