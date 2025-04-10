import { Outlet } from 'react-router';
import Topbar from '../../components/Topbar/Topbar';
import styles from './root.module.css';

export default function Root() {
    return (
        <div className={styles.container}>
            <Topbar />
            <Outlet />
        </div>
    );
}
