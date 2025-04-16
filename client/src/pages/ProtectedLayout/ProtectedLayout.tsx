import useAuth from '../../hooks/useAuth/useAuth';
import { Navigate, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import styles from './protectedLayout.module.css';

type Props = {
    allowedRoles?: string[];
};

export default function ProtectedLayout({ allowedRoles = ['ADMIN', 'DOCTOR', 'PATIENT', 'GUEST'] }: Props) {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user === undefined) {
            return;
        }

        if (!user) {
            navigate('/signin');
            return;
        }

        if (!allowedRoles.includes(user.roles[0])) {
            navigate('/unauthorized');
        }
    }, [user]);

    return (
        <div className={styles.container}>
            <Outlet />
        </div>
    );
}
