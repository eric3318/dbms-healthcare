import Analytics from './Analytics/Analytics';
import People from './People/People';
import UserManagement from './UserManagement/UserManagement';

type Props = {
    active: string;
};

export default function Admin({ active }: Props) {
    return (
        <>
            {active === 'userManagement' && <UserManagement />}
            {active === 'analytics' && <Analytics />}
            {active === 'people' && <People />}
        </>
    );
}
