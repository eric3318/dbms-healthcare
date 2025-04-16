import { useEffect, useState } from 'react';
import AuthForm from '../../components/AuthForm/AuthForm';
import useAuth from '../../hooks/useAuth/useAuth';
import styles from './auth.module.css';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { Text } from '@mantine/core';
import VerificationForm from '../../components/VerificationForm/VerificationForm';
type AuthProps = {
    isSignIn?: boolean;
    isVerification?: boolean;
};

export default function Auth({ isSignIn = true, isVerification = false }: AuthProps) {
    const { authenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isVerification && authenticated) {
            navigate('/');
            return;
        }
    }, [authenticated, navigate, isVerification]);

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                {isVerification ? (
                    <VerificationForm />
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
}
