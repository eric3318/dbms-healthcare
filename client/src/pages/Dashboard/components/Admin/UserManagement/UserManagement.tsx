import { useEffect, useState } from 'react';
import styles from './userManagement.module.css';
import { fetchUsers } from '../../../../../utils/data';
import { Table, TableData } from '@mantine/core';

const tableHeads = [
    {
        label: 'Id',
        value: 'id',
    },
    {
        label: 'Name',
        value: 'name',
    },
    {
        label: 'Email',
        value: 'email',
    },
    {
        label: 'Date of Birth',
        value: 'dateOfBirth',
    },
    {
        label: 'Phone Number',
        value: 'phoneNumber',
    },
    {
        label: 'Roles',
        value: 'roles',
    },
    {
        label: 'Created at',
        value: 'createdAt',
    },
];

export default function UserManagement() {
    const [table, setTable] = useState<TableData>({});

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const users = await fetchUsers();

        setTable({
            head: tableHeads.map((head) => head.label),
            body: users.map((user) => tableHeads.map((head) => user[head.value as keyof typeof user])),
        });
    };

    return (
        <>
            <div className={styles.tableContainer}>
                <Table data={table} verticalSpacing="lg" />
            </div>
        </>
    );
}
