import styles from './slotPicker.module.css';
import { DatePicker } from '@mantine/dates';
import { Slot } from '../../lib/types';
import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { Button, Text } from '@mantine/core';

type Props = {
    items: Slot[];
    onSelect: (slotId: string) => void;
};

export default function SlotPicker({ items, onSelect }: Props) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [filteredItems, setFilteredItems] = useState<Slot[]>([]);

    const handleSlotSelect = (slotId: string) => {
        setSelectedSlotId(slotId);
        onSelect(slotId);
    };

    useEffect(() => {
        if (!selectedDate) {
            setFilteredItems([]);
            return;
        }

        setFilteredItems(items.filter((slot) => isSameDay(new Date(slot.startTime as string), selectedDate)));
    }, [selectedDate]);

    return (
        <div className={styles.container}>
            <div className={styles.datePickerContainer}>
                <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    maxLevel="month"
                    minDate={new Date()}
                    allowDeselect
                    excludeDate={(date) => {
                        const hasSlot = items.some((slot) => isSameDay(new Date(slot.startTime as string), date));
                        return !hasSlot;
                    }}
                    size="xl"
                    classNames={{
                        weekday: styles.datePicker,
                        day: styles.datePicker,
                    }}
                />
            </div>

            <div className={styles.timePicker}>
                {selectedDate && (
                    <>
                        <div className={styles.header}>
                            <Text fw={500} size="xl" style={{ textAlign: 'center' }}>
                                {format(new Date(selectedDate), 'MMMM d, yyyy')}
                            </Text>
                        </div>

                        <div className={styles.slotContainer}>
                            {filteredItems.map((item) => (
                                <Button
                                    key={item.id}
                                    variant={selectedSlotId === item.id ? 'filled' : 'outline'}
                                    color="blue"
                                    size="lg"
                                    radius="lg"
                                    w={250}
                                    disabled={item.status === 'BOOKED'}
                                    onClick={() => handleSlotSelect(item.id as string)}
                                >
                                    {format(new Date(item.startTime as string), 'h:mm a')} -{' '}
                                    {format(new Date(item.endTime as string), 'h:mm a')}
                                </Button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
