import React, { useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { User } from '../types';

interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

const UserTableView: React.FC<UserTableProps> = ({ users, onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;

    const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const columns = [

        {
            title: 'Email',
            dataIndex: 'email',
            render: (_: string, record: User) => (
                <div className="flex items-center gap-3">
                    <img src={record.avatar} alt={record.first_name} className="w-8 h-8 rounded-full" />
                    <span>{record.email}</span>
                </div>
            ),
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
        },
        {
            title: 'Action',
            render: (_: any, record: User) => (
                <>
                    <Button type="primary" size="small" className="bg-blue-600 hover:bg-blue-700 text-white mr-2" onClick={() => onEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ style: { backgroundColor: '#1677ff', borderColor: '#1677ff' } }}
                    >
                        <Button type="primary" danger size="small">Delete</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div className="flex-1 overflow-y-auto">
            <Table
                dataSource={paginatedUsers}
                columns={columns}
                rowKey="id"
                pagination={{
                    current: currentPage,
                    pageSize,
                    total: users.length,
                    onChange: setCurrentPage,
                    showSizeChanger: false,
                }}
            />
        </div>
    );
};

export default UserTableView;