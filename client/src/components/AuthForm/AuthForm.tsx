import { useForm } from '@mantine/form';
import { Button, TextInput, PasswordInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import styles from './authForm.module.css';
import { login, register } from '../../utils/data';
import { Link, useNavigate } from 'react-router';

type FormValues = {
    name?: string;
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

    const form = useForm<FormValues>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
            ...(!isSignIn && { name: '', confirmPassword: '', dateOfBirth: '', phoneNumber: '' }),
        },
        validate: {
            confirmPassword: (value, values) =>
                !isSignIn && value !== values.password ? 'Passwords do not match' : null,
        },
    });

    const handleSubmit = async (values: FormValues) => {
        if (isSignIn) {
            await login({
                email: values.email,
                password: values.password,
            });
        } else {
            await register({
                name: values.name, // add validation
                email: values.email,
                password: values.password,
                dateOfBirth: values.dateOfBirth,
                phoneNumber: values.phoneNumber,
            });
        }

        navigate('/');
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)} className={styles.form}>
            <TextInput
                withAsterisk
                label="Email"
                placeholder="Enter your email"
                key={form.key('email')}
                {...form.getInputProps('email')}
                classNames={{
                    input: styles.textInput,
                }}
            />

            {!isSignIn && (
                <>
                    <TextInput
                        withAsterisk
                        label="Name"
                        placeholder="Enter your name"
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                        classNames={{
                            input: styles.textInput,
                        }}
                    />

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
                        classNames={{
                            input: styles.textInput,
                        }}
                    />
                </>
            )}

            <PasswordInput
                withAsterisk
                label="Password"
                placeholder="Enter your password"
                type="password"
                key={form.key('password')}
                {...form.getInputProps('password')}
                classNames={{
                    input: styles.textInput,
                }}
            />

            {!isSignIn && (
                <PasswordInput
                    withAsterisk
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    type="password"
                    key={form.key('confirmPassword')}
                    {...form.getInputProps('confirmPassword')}
                    classNames={{
                        input: styles.textInput,
                    }}
                    styles={(theme) => ({
                        input: {
                            '&:focus': {
                                color: theme.colors.red[6],
                                borderColor: theme.colors.red[6],
                            },
                        },
                    })}
                />
            )}

            <Button type="submit" radius={'md'}>
                {isSignIn ? 'Login' : 'Sign Up'}
            </Button>

            {!isSignIn ? (
                <p className={styles.text}>
                    Already have an account? <Link to="/signin">Log in</Link>
                </p>
            ) : (
                <p className={styles.text}>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            )}
        </form>
    );
}
