import { Tabs } from '@mantine/core';
import styles from './people.module.css';
import { IconPhoto } from '@tabler/icons-react';

const tabs = [
    {
        label: 'Doctors',
        value: 'doctors',
    },
    {
        label: 'Patients',
        value: 'patients',
    },
];

export default function People() {
    return (
        <>
            <Tabs defaultValue={tabs[0].value}>
                <Tabs.List>
                    {tabs.map((tab) => (
                        <Tabs.Tab value={tab.value} leftSection={<IconPhoto size={12} />}>
                            {tab.label}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>

                <Tabs.Panel value={tabs[0].value}>Gallery tab content</Tabs.Panel>

                <Tabs.Panel value={tabs[1].value}>Messages tab content</Tabs.Panel>
            </Tabs>
        </>
    );
}
