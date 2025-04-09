import styles from './admin.module.css';

type Props = {
    active: string;
};

export default function Admin({ active }: Props) {
    return <div className={styles.container}></div>;
}
