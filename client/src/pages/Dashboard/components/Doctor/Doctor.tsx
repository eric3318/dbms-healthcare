import Appointments from './Appointments/Appointments';
import Records from './Records/Records';
import RequisitionResults from './RequisitionResults/RequisitionResults';

type Props = {
    active: string;
};

export default function Doctor({ active }: Props) {
    return (
        <>
            {active === 'appointments' && <Appointments />}
            {active === 'records' && <Records />}
            {active === 'requisitionResults' && <RequisitionResults />}
        </>
    );
}
