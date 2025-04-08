import styles from './patient.module.css';
import MyAppointments from './MyAppointments/MyAppointments';

type Props = {
    active: string;
};

const Requisitions = () => {
    return <div>Requisitions</div>;
};

const PastVisits = () => {
    return <div>PastVisits</div>;
};

export default function Patient({ active }: Props) {
    return (
        <div className={styles.container}>
            {active === 'appointments' && <MyAppointments />}

            {active === 'requisitions' && <Requisitions />}

            {active === 'pastVisits' && <PastVisits />}
        </div>
    );
}
