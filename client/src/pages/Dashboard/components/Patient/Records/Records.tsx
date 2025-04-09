import { fetchAppointments } from '../../../../../utils/data';
import { useEffect, useState } from 'react';
import useAuth from '../../../../../hooks/useAuth/useAuth';

export default function Records() {
    const { user } = useAuth();
    const [medicalRecords, setMedicalRecords] = useState([]);

    useEffect(() => {
        getMedicalRecords();
    }, []);

    const getMedicalRecords = async () => {
        // TODO: Fetch medical records
    };

    return <div></div>;
}
