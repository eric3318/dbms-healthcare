import styles from './doctor.module.css';

type Props = {
    active: string;
};

export default function Doctor({ active }: Props) {
    return <div className={styles.container}>{active}</div>;
}
