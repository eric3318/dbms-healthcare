import { useForm } from '@mantine/form';
import { Button, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import styles from './verificationForm.module.css';

type FormValues = {
    name?: string;
    dateOfBirth?: string;
    personalHealthNumber?: string;
};

type VerificationFormProps = {
    onVerificationSuccess: () => void;
};

export default function VerificationForm({ onVerificationSuccess }: VerificationFormProps) {
    const form = useForm<FormValues>({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            dateOfBirth: '',
            personalHealthNumber: '',
        },
    });

    const handleSubmit = async (values: FormValues) => {
        // add db check
        onVerificationSuccess();
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
            <TextInput
                withAsterisk
                label="Name"
                placeholder="Enter your name"
                key={form.key('name')}
                {...form.getInputProps('name')}
            />

            <TextInput
                withAsterisk
                label="Personal Health Number"
                placeholder="Enter your personal health number"
                key={form.key('personalHealthNumber')}
                {...form.getInputProps('personalHealthNumber')}
            />

            <DateInput
                label="Date of birth"
                placeholder="Date of birth"
                withAsterisk
                key={form.key('dateOfBirth')}
                {...form.getInputProps('dateOfBirth')}
            />

            <Button type="submit">Submit</Button>
        </form>
    );
}
