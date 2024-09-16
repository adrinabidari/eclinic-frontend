"use client"

import Admin from '../page'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Table, Button, Space, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Patient = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState(false);

    const [messageApi, contextHolder] = message.useMessage();

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this patient?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setUpdating(true); // Start loading spinner for delete
                    await axios.delete(`/api/delete-patient/${id}`);
                    messageApi.success('Patient deleted successfully!');
                    getPatients();
                } catch (error) {
                    console.error(error);
                    messageApi.error('Failed to delete patient.');
                } finally {
                    setUpdating(false); // Stop loading spinner
                }
            },
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: ['user'],
            showSorterTooltip: {
                target: 'full-header',
            },
            sorter: (a, b) => a.user.name.localeCompare(b.user.name),
            render: (user) => {
                return (
                    <div className='flex items-center'>
                        <img
                            src={process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/' + (user.profile != null ? user.profile : 'images/placeholder.jpg')}
                            width={30}
                            height={30}
                            className='rounded-full ring-2 ring-white'
                        />

                        <span className='ml-2'>{user.name}</span>
                    </div>
                );
            },
        },
        {
            title: 'E-mail',
            dataIndex: ['user', 'email'],
        },
        {
            title: 'Registered On',
            dataIndex: 'created_at',
            render: (date) => <span>{new Date(date).toLocaleDateString()}</span>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const router = useRouter();
                return <Space size="middle">
                    <Button
                        onClick={() => router.push(`/admin/patients/${record.user_id}`)}
                        shape="circle" icon={<EditOutlined />} />
                    <Button
                        onClick={() => handleDelete(record.user_id)}
                        shape="circle"
                        icon={<DeleteOutlined />}
                        loading={updating} // Show spinner while deleting
                    />
                </Space>
            },
        },
    ];


    const getPatients = async () => {
        setLoading(true)
        try {
            const response = await axios
                .get('/api/all-patients')
                .then(res => {
                    setPatients(res.data);
                    setLoading(false)
                }
                )
                .catch(error => {
                    setLoading(false)
                });
        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        getPatients();
    }, [])

    return (
        <Admin>
            {contextHolder}

            <div className='flex justify-between mb-5'>
                <h2 className='text-xl'>All Patients</h2>
                <Link href='/admin/patients/create'>
                    <Button type="primary" icon={<PlusOutlined />} >
                        Add New Patient
                    </Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={patients}
                showSorterTooltip={{
                    target: 'sorter-icon',
                }}
                bordered={true}
                size='middle'
                rowKey='id'
                loading={loading}
            />
        </Admin>
    )
}

export default Patient