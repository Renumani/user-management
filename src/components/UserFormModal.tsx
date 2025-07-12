// src/components/UserFormModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input } from 'antd';
import { useAppDispatch } from '../hooks';
import { apiPost, apiPut, USERS } from '../api';
import { fetchUsers } from '../features/users/usersSlice';
import { User } from '../types';

interface Props {
    user?: User;
    isOpen: boolean;
    onClose: () => void;
}

const UserFormModal: React.FC<Props> = ({ user, isOpen, onClose }) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue(user);
        } else {
            form.resetFields();
        }
    }, [user, form]);

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            if (user) {
                await apiPut(`${USERS}/${user.id}`, values);
            } else {
                await apiPost(USERS, values);
            }

            dispatch(fetchUsers());
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={user ? 'Edit User' : 'Create User'}
            open={isOpen}
            onOk={handleSubmit}
            onCancel={onClose}
            confirmLoading={loading}
            okText={user ? 'Update' : 'Create'}
            cancelText="Cancel"
            okButtonProps={{ className: 'bg-blue-600 hover:bg-blue-700 text-white' }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter first name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter last name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="avatar"
                    label="Profile Image Link"
                    rules={[{ required: true, message: 'Please enter profile image link' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserFormModal;