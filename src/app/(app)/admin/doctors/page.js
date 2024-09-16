"use client"
import Admin from '../page'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Table, Button, Space, Tag, Modal, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState(false)

    const getDoctors = async () => {
        setLoading(true)
        try {
            const response = await axios
                .get('/api/doctors')
                .then(res => {
                    setDoctors(res.data);
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


    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this doctor?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setUpdating(true); // Start loading spinner for delete
                    await axios.delete(`/api/delete-doctor/${id}`);
                    message.success('Doctor deleted successfully!');
                    getDoctors();
                } catch (error) {
                    console.error(error);
                    message.error('Failed to delete doctor.');
                } finally {
                    setUpdating(false); // Stop loading spinner
                }
            },
        });
    };
    const columns = [
        {
            title: 'Doctor',
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
            title: 'Gender',
            dataIndex: 'gender',
            // defaultSortOrder: 'descend',
            sorter: (a, b) => a.gender.localeCompare(b.gender),
            render: (gender) => {
                const text = gender == 'M' ? 'MALE' : 'FEMALE';
                return (
                    <span>{text}</span>
                );
            },
        },
        {
            title: 'Specialization',
            dataIndex: ['specialization', 'name'],
            render: (name) => (
                <>
                    <Tag color='blue' key={name}>
                        {name ? name.toUpperCase() : 'N/A'}
                    </Tag>
                </>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            sorter: (a, b) => a.status - b.status,
            render: (status) => {
                const color = status === 1 ? 'green' : 'red';
                const text = status === 1 ? 'Active' : 'Inactive';
                return (
                    <Tag color={color} key={status}>
                        {text}
                    </Tag>
                );
            },
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                const router = useRouter();
                return <Space size="middle">
                    <Button
                        onClick={() => router.push(`/admin/doctors/${record.user_id}`)}
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


    useEffect(() => {
        getDoctors();
    }, [])

    return (
        <Admin>
            <div className='flex justify-between mb-5'>
                <h2 className='text-xl'>All Doctors</h2>
                <Link href='/admin/doctors/create'>
                    <Button type="primary" icon={<PlusOutlined />} >
                        Add New Doctor
                    </Button>
                </Link>
            </div>

            <Table
                columns={columns}
                dataSource={doctors}
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

export default Doctor