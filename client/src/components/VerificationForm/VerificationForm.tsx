import { useForm } from '@mantine/form';
import { Button, TextInput } from '@mantine/core';
import { Radio, Group } from '@mantine/core';
import styles from './verificationForm.module.css';
import { useState } from 'react';
import { verifyIdentity } from '../../utils/data';
type FormValues = {
    name?: string;
    personalHealthNumber?: string;
    licenseNumber?: string;
};

type VerificationFormProps = {
    onVerificationSuccess: () => void;
};

export default function VerificationForm({ onVerificationSuccess }: VerificationFormProps) {
    const [identityType, setIdentityType] = useState<string>('practitioner');

    const form = useForm<FormValues>({
        mode: 'uncontrolled',
        initialValues: {
            name: '',
            ...(identityType === 'patient' && { personalHealthNumber: '' }),
            ...(identityType === 'practitioner' && { licenseNumber: '' }),
        },
    });

    const handleSubmit = async (values: FormValues) => {
        const payload = {
            name: values.name,
            ...(identityType === 'patient' && { personalHealthNumber: values.personalHealthNumber }),
            ...(identityType === 'practitioner' && { licenseNumber: values.licenseNumber }),
        };
        const success = await verifyIdentity(payload);
        if (success) {
            onVerificationSuccess();
        }
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

            <Radio.Group
                name="identityType"
                label="Select your identity type"
                withAsterisk
                value={identityType}
                onChange={setIdentityType}
            >
                <Group mt="xs">
                    <Radio value="practitioner" label="Practitioner" />
                    <Radio value="patient" label="Patient" />
                </Group>
            </Radio.Group>

            {identityType === 'patient' && (
                <TextInput
                    withAsterisk
                    label="Personal Health Number"
                    placeholder="Enter your personal health number"
                    key={form.key('personalHealthNumber')}
                    {...form.getInputProps('personalHealthNumber')}
                />
            )}

            {identityType === 'practitioner' && (
                <TextInput
                    withAsterisk
                    label="License Number"
                    placeholder="Enter your license number"
                    key={form.key('licenseNumber')}
                    {...form.getInputProps('licenseNumber')}
                />
            )}

            <Button type="submit">Submit</Button>
        </form>
    );
}
