import MyAppointments from './MyAppointments/MyAppointments';
import Records from './Records/Records';
import Requisitions from './Requisitions/Requisitions';

type Props = {
    active: string;
};

export default function Patient({ active }: Props) {
    return (
        <>
            {active === 'appointments' && <MyAppointments />}

            {active === 'requisitions' && <Requisitions />}

            {active === 'records' && <Records />}
        </>
    );
}
