import useAuth from '../../hooks/useAuth/useAuth';
import styles from './dashboard.module.css';
import { Loader } from '@mantine/core';
import VerticalBar from '../../components/VerticalBar/VerticalBar';
import Doctor from './components/Doctor/Doctor';
import Patient from './components/Patient/Patient';
import Admin from './components/Admin/Admin';
import { useState, useEffect } from 'react';

type Option = {
    label: string;
    value: string;
};

const options: Record<string, Option[]> = {
    admin: [{ label: 'Directory', value: 'directory' }],
    patient: [
        { label: 'Appointments', value: 'appointments' },
        { label: 'Requisitions', value: 'requisitions' },
        { label: 'Past visits', value: 'pastVisits' },
    ],
    doctor: [
        { label: 'Appointments', value: 'appointments' },
        { label: 'Prescriptions', value: 'prescriptions' },
    ],
};

export default function Dashboard() {
    const { user } = useAuth();
    const userRole = user?.roles?.[0].toLowerCase();
    const [active, setActive] = useState<string>('');

    useEffect(() => {
        if (userRole && options[userRole]) {
            setActive(options[userRole][0].value);
        }
    }, [userRole]);

    if (!userRole) return <Loader />;

    return (
        <div className={styles.container}>
            <VerticalBar options={options[userRole]} active={active} onChange={setActive} />

            {userRole === 'admin' && <Admin />}
            {userRole === 'patient' && <Patient active={active} />}
            {userRole === 'doctor' && <Doctor />}
        </div>
    );
}
