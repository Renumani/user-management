import React from 'react';
import { User } from '../types';
import { Card, Popconfirm, Tooltip, Avatar, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface UserCardViewProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

const UserCardView: React.FC<UserCardViewProps> = ({ users, onEdit, onDelete }) => {
    return (
        <>
            {users?.length === 0 ? (<div className="gap-5 bg-gray-200 flex items-center justify-center h-screen">
                <h3 className='text-xl'>No data</h3>
            </div>) :
                (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 bg-gray-200 flex-1 overflow-y-auto p-6">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="group rounded hover:bg-gray-200 transition-colors duration-300 p-2"
                        >
                            <Card
                                className="relative h-[35vh] text-center border shadow-lg transition duration-300"
                                cover={
                                    <div className="flex justify-center mt-4">
                                        <Avatar size={100} src={user.avatar} />
                                    </div>
                                }
                            >
                                <Card.Meta
                                    title={<div className="font-semibold text-[1vw]">{user.first_name} {user.last_name}</div>}
                                    description={
                                        <a href={`mailto:${user.email}`} className="flex justify-center items-center gap-1 mt-2 text-[0.8vw]">
                                            {user.email}
                                        </a>
                                    }
                                />
                                <div className="absolute inset-0 flex justify-center items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200/70">
                                    <Tooltip title="Edit">
                                        <Button
                                            type="primary"
                                            className="bg-violet-600 text-white hover:bg-violet-700 border-none text-xl rounded-full px-4"
                                            icon={<EditOutlined />}
                                            onClick={() => onEdit(user)}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <Popconfirm
                                            title="Are you sure to delete this user?"
                                            onConfirm={() => onDelete(user.id)}
                                            okText="Yes"
                                            cancelText="No"
                                            okButtonProps={{ style: { backgroundColor: '#1677ff', borderColor: '#1677ff' } }}
                                        >
                                            <Button
                                                type="primary"
                                                className="bg-red-600 text-white hover:bg-red-700 border-none text-xl rounded-full px-4"
                                                icon={<DeleteOutlined />}
                                                onClick={() => onEdit(user)}
                                            />
                                        </Popconfirm>
                                    </Tooltip>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>)}</>
    );
};

export default UserCardView;