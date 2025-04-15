import { useEffect, useState } from 'react';
import AuthForm from '../../components/AuthForm/AuthForm';
import useAuth from '../../hooks/useAuth/useAuth';
import styles from './auth.module.css';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { Text } from '@mantine/core';

type AuthProps = {
    isSignIn: boolean;
};

export default function Auth({ isSignIn }: AuthProps) {
    const { authenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authenticated) {
            navigate('/');
        }
    }, [authenticated, navigate]);

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <Text size="xl" fw="bold">
                    {isSignIn ? 'Login' : 'Sign Up'}
                </Text>

                <AuthForm isSignIn={isSignIn} />

                {isSignIn ? (
                    <Text>
                        Don't have an account? <Link to="/signup">Sign up</Link>
                    </Text>
                ) : (
                    <Text>
                        Already have an account? <Link to="/signin">Log in</Link>
                    </Text>
                )}
            </div>
        </div>
    );
}
