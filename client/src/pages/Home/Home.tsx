import { Stack, Text, Button } from '@mantine/core';
import mainImage from '/main.webp';
import styles from './home.module.css';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth/useAuth';

export default function Home() {
    const { user } = useAuth();
    const role = user?.roles?.[0].toLowerCase();

    return (
        <div className={styles.container}>
            <div className={styles.mainImageContainer}>
                <Stack className={styles.contentContainer}>
                    <Text fz={52} fw={900} c="white">
                        Welcome to our clinic
                    </Text>

                    {role === 'patient' && (
                        <div>
                            <Button
                                component={Link}
                                to="/booking"
                                size="xl"
                                styles={{ root: { backgroundColor: 'red' } }}
                            >
                                Book an appointment
                            </Button>
                        </div>
                    )}
                </Stack>

                <img src={mainImage} alt="main" className={styles.mainImage} />
            </div>

            <div>
                <Text fz={32} fw={900}>
                    Our Services
                </Text>
            </div>
        </div>
    );
}
