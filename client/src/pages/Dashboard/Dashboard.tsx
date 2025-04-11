import useAuth from '../../hooks/useAuth/useAuth';
import styles from './dashboard.module.css';
import VerticalBar from '../../components/VerticalBar/VerticalBar';
import Doctor from './components/Doctor/Doctor';
import Patient from './components/Patient/Patient';
import Admin from './components/Admin/Admin';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Option = {
    label: string;
    value: string;
};

const options: Record<string, Option[]> = {
    admin: [
        { label: 'Users', value: 'userManagement' },
        { label: 'Analytics', value: 'analytics' },
        { label: 'People', value: 'people' },
    ],
    patient: [
        { label: 'Appointments', value: 'appointments' },
        { label: 'Records', value: 'records' },
        { label: 'Requisitions', value: 'requisitions' }, // lab tests that need to be done
    ],
    doctor: [
        { label: 'Appointments', value: 'appointments' },
        { label: 'Records', value: 'records' },
        { label: 'Requisition Results', value: 'requisitionResults' }, // lab results that have come in
    ],
};

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (user === null) {
        navigate('/signin');
        return;
    }

    const userRoles = user?.roles;

    const [activeOption, setActiveOption] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    useEffect(() => {
        if (userRoles) {
            // setSelectedRole(userRoles[0].toLowerCase());
            setSelectedRole('admin');
            setActiveOption(options[userRoles[0].toLowerCase()][0].value);
        }
    }, [userRoles]);

    return (
        <div className={styles.container}>
            {user && selectedRole && (
                <VerticalBar
                    user={user}
                    selectedRole={selectedRole}
                    onRoleChange={setSelectedRole}
                    options={options[selectedRole]}
                    active={activeOption}
                    onChange={setActiveOption}
                />
            )}

            <div className={styles.contentContainer}>
                {selectedRole === 'admin' && <Admin active={activeOption} />}
                {selectedRole === 'patient' && <Patient active={activeOption} />}
                {selectedRole === 'doctor' && <Doctor active={activeOption} />}
            </div>
        </div>
    );
}