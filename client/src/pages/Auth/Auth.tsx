import { useEffect, useState } from 'react';
import AuthForm from '../../components/AuthForm/AuthForm';
import useAuth from '../../hooks/useAuth/useAuth';
import styles from './auth.module.css';
import { Alert } from '@mantine/core';
import { useNavigate } from 'react-router';
import VerificationForm from '../../components/VerificationForm/VerificationForm';
import { Link } from 'react-router';
import { Text } from '@mantine/core';

type AuthProps = {
    isSignIn: boolean;
};

export default function Auth({ isSignIn }: AuthProps) {
    const { authenticated } = useAuth();
    const navigate = useNavigate();
    const [isVerified, setIsVerified] = useState<boolean>(false);

    useEffect(() => {
        if (authenticated) {
            navigate('/');
        }
    }, [authenticated, navigate]);

    const handleVerificationSuccess = () => {
        setIsVerified(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <Text size="xl" fw="bold">
                    {isSignIn ? 'Login' : 'Sign Up'}
                </Text>

                {isSignIn ? (
                    <AuthForm isSignIn={isSignIn} />
                ) : isVerified ? (
                    <AuthForm isSignIn={isSignIn} />
                ) : (
                    <>
                        <Alert
                            p="lg"
                            title="Identify verification"
                            classNames={{ label: styles.alertLabel, message: styles.alertMessage }}
                        >
                            In order to protect your privacy and ensure nobody else can access your information, we need
                            to verify your identity before you can proceed.
                        </Alert>

                        <VerificationForm onVerificationSuccess={handleVerificationSuccess} />
                    </>
                )}

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
