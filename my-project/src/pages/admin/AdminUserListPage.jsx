// src/pages/admin/AdminUserListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { FaSpinner, FaTrash, FaCheck, FaTimes, FaUserShield, FaUser } from 'react-icons/fa';
import ConfirmationModal from '../../components/common/ConfirmationModal';

const AdminUserListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userInfo, loadingAuth } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });

    const fetchUsers = useCallback(async () => {
        if (!userInfo) return;
        setLoading(true);
        setError('');
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('/api/users', config);
            setUsers(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка загрузки пользователей');
        } finally {
            setLoading(false);
        }
    }, [userInfo]);

    useEffect(() => {
        if (!loadingAuth && userInfo && userInfo.isAdmin) {
            fetchUsers();
        }
    }, [userInfo, loadingAuth, fetchUsers]);

    const openConfirmationModal = (action, content) => {
        setModalAction(() => action);
        setModalContent(content);
        setIsModalOpen(true);
    };

    const handleDeleteRequest = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`/api/users/${id}`, config);
            fetchUsers();
        } catch (err) {
            alert(`Ошибка удаления: ${err.response?.data?.message || err.message}`);
        } finally {
            setIsModalOpen(false);
        }
    };

    const deleteHandler = (user) => {
        openConfirmationModal(
            () => handleDeleteRequest(user._id),
            { title: `Удалить пользователя?`, message: `Вы уверены, что хотите удалить ${user.name}? Это действие необратимо.` }
        );
    };

    const toggleAdminHandler = (user) => {
        const actionText = user.isAdmin ? 'снять права администратора с' : 'назначить администратором';
        openConfirmationModal(
            async () => {
                try {
                    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                    await axios.put(`/api/users/${user._id}`, { isAdmin: !user.isAdmin }, config);
                    fetchUsers();
                } catch (err) {
                    alert(`Ошибка обновления: ${err.response?.data?.message || err.message}`);
                } finally {
                    setIsModalOpen(false);
                }
            },
            { title: 'Изменить права', message: `Вы уверены, что хотите ${actionText} пользователя ${user.name}?`, confirmText: "Изменить" }
        );
    };

    if (loading) {
        return <div className="p-8 text-center"><FaSpinner className="animate-spin text-4xl text-brand-blue" /></div>;
    }
    
    if (error) {
        return <div className="bg-red-900/50 p-4 rounded-lg">{error}</div>;
    }

    return (
        <>
            <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={modalAction} {...modalContent} />
            <div>
                <h1 className="text-2xl font-semibold text-white mb-6">Пользователи ({users.length})</h1>
                <div className="bg-brand-bg-black shadow-xl rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-brand-border-gray">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Логин</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Админ</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="bg-brand-bg-black divide-y divide-brand-border-gray">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-400">{user._id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white"><Link to={`/admin/user/${user._id}`} className="hover:text-brand-blue hover:underline">{user.name}</Link></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">{user.isAdmin ? <FaCheck className="text-green-500 mx-auto" /> : <FaTimes className="text-red-500 mx-auto" />}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {userInfo._id !== user._id && (
                                            <>
                                                <button onClick={() => toggleAdminHandler(user)} title={user.isAdmin ? "Снять права админа" : "Сделать админом"} className={`p-1.5 rounded-md inline-flex transition-colors ${user.isAdmin ? 'text-yellow-400 bg-yellow-600/20 hover:bg-yellow-600/30' : 'text-green-400 bg-green-600/20 hover:bg-green-600/30'}`}>{user.isAdmin ? <FaUser /> : <FaUserShield />}</button>
                                                {!user.isAdmin && (<button onClick={() => deleteHandler(user)} className="text-red-400 hover:text-red-300 p-1.5 bg-red-600/20 hover:bg-red-600/30 rounded-md inline-flex"><FaTrash /></button>)}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminUserListPage;