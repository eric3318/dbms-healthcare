import { useForm } from '@mantine/form';
import { Button, TextInput, PasswordInput, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import styles from './authForm.module.css';
import { Link, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth/useAuth';

type FormValues = {
    email: string;
    password: string;
    confirmPassword?: string;
    dateOfBirth?: string;
    phoneNumber?: string;
};

type AuthFormProps = {
    isSignIn: boolean;
};

export default function AuthForm({ isSignIn }: AuthFormProps) {
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const form = useForm<FormValues>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
            ...(!isSignIn && { confirmPassword: '', dateOfBirth: '', phoneNumber: '' }),
        },
        validate: {
            confirmPassword: (value, values) =>
                !isSignIn && value !== values.password ? 'Passwords do not match' : null,
        },
    });

    const handleSubmit = async (values: FormValues) => {
        if (isSignIn) {
            const loginSuccess = await login({
                email: values.email,
                password: values.password,
            });

            if (loginSuccess) {
                navigate('/');
            }
        } else {
            const registerSuccess = await register({
                email: values.email,
                password: values.password,
                dateOfBirth: values.dateOfBirth,
                phoneNumber: values.phoneNumber,
            });

            if (registerSuccess) {
                navigate('/');
            }
        }
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
            <TextInput
                withAsterisk
                label="Email"
                placeholder="Enter your email"
                key={form.key('email')}
                {...form.getInputProps('email')}
            />

            <PasswordInput
                withAsterisk
                label="Password"
                placeholder="Enter your password"
                type="password"
                key={form.key('password')}
                {...form.getInputProps('password')}
            />

            {!isSignIn && (
                <>
                    <PasswordInput
                        withAsterisk
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        type="password"
                        key={form.key('confirmPassword')}
                        {...form.getInputProps('confirmPassword')}
                        styles={(theme) => ({
                            input: {
                                '&:focus': {
                                    color: theme.colors.red[6],
                                    borderColor: theme.colors.red[6],
                                },
                            },
                        })}
                    />{' '}
                    <DateInput
                        label="Date of birth"
                        placeholder="Date of birth"
                        withAsterisk
                        key={form.key('dateOfBirth')}
                        {...form.getInputProps('dateOfBirth')}
                    />
                    <TextInput
                        withAsterisk
                        label="Phone number"
                        placeholder="Enter your phone number"
                        key={form.key('phoneNumber')}
                        {...form.getInputProps('phoneNumber')}
                    />
                </>
            )}

            <Button type="submit" radius={'md'}>
                {isSignIn ? 'Login' : 'Sign Up'}
            </Button>
        </form>
    );
}
