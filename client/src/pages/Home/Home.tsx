import { Stack, Text, Button } from '@mantine/core';
import mainImage from '/main.webp';
import styles from './home.module.css';
import { Link } from 'react-router';

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.mainImageContainer}>
                <Stack className={styles.contentContainer}>
                    <Text fz={52} fw={900} c="white">
                        Welcome to our clinic
                    </Text>

                    <div>
                        <Button
                            component={Link}
                            to="/appointment"
                            size="xl"
                            styles={{ root: { backgroundColor: 'red' } }}
                        >
                            Book an appointment
                        </Button>
                    </div>
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
