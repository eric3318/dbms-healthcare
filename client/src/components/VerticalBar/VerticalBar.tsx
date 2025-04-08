import { Button } from '@mantine/core';
import styles from './verticalBar.module.css';

type Option = {
    label: string;
    value: string;
};

type Props = {
    options: Option[];
    active: string;
    onChange: (value: string) => void;
};

export default function VerticalBar({ options, active, onChange }: Props) {
    return (
        <div className={styles.container}>
            {options.map((option) => (
                <Button
                    key={option.value}
                    variant={active === option.value ? 'light' : 'white'}
                    c="dark"
                    size="lg"
                    radius={0}
                    h={64}
                    onClick={() => onChange(option.value)}
                >
                    {option.label}
                </Button>
            ))}
        </div>
    );
}
