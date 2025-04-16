import { Modal, Stack, Text, Textarea, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Appointment } from '../../lib/types';
import { updateAppointment } from '../../utils/data';
import { notifications } from '@mantine/notifications';
type Props = {
    opened: boolean;
    onClose: () => void;
    item: Appointment;
};

type FormValues = {
    visitReason: string;
};

export default function AppointmentEditModal({ opened, onClose, item }: Props) {
    const form = useForm<FormValues>({
        initialValues: {
            visitReason: item.visitReason || '',
        },
        validate: {
            visitReason: (value) => {
                if (!value) return 'Visit reason is required';
                if (value.length < 10) return 'Visit reason must be at least 10 characters';
                if (value.length > 500) return 'Visit reason must not exceed 500 characters';
                return null;
            },
        },
    });

    const handleSubmit = async (values: FormValues) => {
        try {
            const success = await updateAppointment(item.id as string, values);

            if (success) {
                onClose();
                notifications.show({
                    title: 'Success',
                    message: 'Appointment updated successfully',
                    color: 'green',
                });
            }
        } catch (error) {
            console.error('Failed to update appointment:', error);
            notifications.show({
                title: 'Error',
                message: 'Failed to update appointment',
                color: 'red',
            });
        }
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Text size="lg" fw={500}>
                    Edit Appointment
                </Text>
            }
            size="md"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <Text c="dimmed">
                        Please provide a detailed reason for your visit to help the doctor prepare for your appointment.
                    </Text>

                    <Textarea
                        label="Visit Reason"
                        placeholder={item.visitReason || ''}
                        minRows={4}
                        maxRows={8}
                        autosize
                        {...form.getInputProps('visitReason')}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="subtle" onClick={onClose}>
                            Cancel
                        </Button>

                        <Button type="submit" color="blue">
                            Submit Changes
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
