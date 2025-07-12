import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchUsers } from '../features/users/usersSlice';
import { logout } from '../features/auth/authSlice';
import { Button, Spin, Alert, message, Segmented, Input } from 'antd';
import { User } from '../types';
import UserFormModal from '../components/UserFormModal';
import UserTableView from '../components/UserTableView';
import UserCardView from '../components/UserCardView';
import { apiDelete, USERS } from '../api/index';
import { TableOutlined, AppstoreOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | undefined>(undefined);
  const [view, setView] = useState<'table' | 'card'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.first_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        user.last_name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [users, debouncedSearch]);

  const openCreateModal = () => {
    setEditUser(undefined);
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await apiDelete(`${USERS}${id}`);
      message.success('User deleted');
      dispatch(fetchUsers());
    } catch (err) {
      console.error(err);
      message.error('Failed to delete user');
    }
  };

  return (
    <div className='flex flex-col h-screen bg-gray-200' >
      <div className="bg-gray-900 h-[8%] flex items-center justify-end px-4 gap-4">
        <h1 className="text-xl text-white">Elon Musk</h1>
        <Button type="primary" className="text-white bg-orange-600 w-6 h-7" icon={<LogoutOutlined />} onClick={() => {
          dispatch(logout());
          navigate('/');
        }} />
      </div>
      <div className="bg-white h-[92%] m-8 p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Users</h2>
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
              suffix={<SearchOutlined className="text-gray-500" />}
            />
            <Button type="primary" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={openCreateModal}>
              Create User
            </Button>
          </div>
        </div>

        <Segmented
          className="[&_.ant-segmented-item-selected]:outline [&_.ant-segmented-item-selected]:outline-blue-500 my-2 bg-white"
          options={[
            {
              label: (
                <span className="flex items-center gap-1">
                  <TableOutlined />
                  Table
                </span>
              ), value: 'table'
            },
            {
              label: <span className="flex items-center gap-1">
                <AppstoreOutlined />
                Card View
              </span>, value: 'card'
            },
          ]}
          value={view}
          onChange={(val) => setView(val as 'table' | 'card')}
        />

        {error && <Alert type="error" message={error} showIcon />}
        {loading ? (
          <div className="flex justify-center my-10">
            <Spin size="large" />
          </div>
        ) : view === 'card' ? (
          <UserCardView users={filteredUsers} onEdit={openEditModal} onDelete={handleDelete} />
        ) : (
          <UserTableView users={filteredUsers} onEdit={openEditModal} onDelete={handleDelete} />
        )}

        <UserFormModal user={editUser} isOpen={modalOpen} onClose={closeModal} />
      </div>
    </div>
  );
};

export default Users;