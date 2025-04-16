import { Outlet } from 'react-router';
import Topbar from '../../components/Topbar/Topbar';
import styles from './rootLayout.module.css';

export default function RootLayout() {
    return (
        <div className={styles.container}>
            <Topbar />
            <Outlet />
        </div>
    );
}
