"use client"

import Admin from '../page'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Table, Button, Space, Tag, Modal, message } from "antd";
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';

const Staff = () => {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();


    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this staff?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setUpdating(true);
                    await axios.delete(`/api/delete-staff/${id}`);
                    messageApi.success('Staff deleted successfully!');
                    getStaffs();
                } catch (error) {
                    console.error(error);
                    messageApi.error('Failed to delete staff.');
                } finally {
                    setUpdating(false);
                }
            },
        });
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            // dataIndex: 
            showSorterTooltip: {
                target: 'full-header',
            },
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (_, record) => {
                return (
                    <div className='flex items-center'>
                        <img
                            src={process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/' + (record.profile != null ? record.profile : 'images/placeholder.jpg')}
                            width={30}
                            height={30}
                            className='rounded-full ring-2 ring-white'
                        />

                        <span className='ml-2'>{record.name}</span>
                    </div>
                );
            },
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role_id',
            render: (status) => {
                const color = status === process.env.NEXT_PUBLIC_ADMIN_ID ? 'blue' : 'green';
                const text = status === process.env.NEXT_PUBLIC_ADMIN_ID ? 'Admin' : 'Staff';
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
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        onClick={() => handleDelete(record.id)}
                        shape="circle"
                        icon={<DeleteOutlined />}
                        loading={updating} // Show spinner while deleting
                    />
                </Space>
            ),
        },
    ];

    const getStaffs = async () => {
        setLoading(true)
        try {
            const response = await axios
                .get('/api/all-staffs')
                .then(res => {
                    setStaffs(res.data);
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
        getStaffs();
    }, [])

    return (
        <Admin>
            {contextHolder}
            <div className='flex justify-between mb-5'>
                <h2 className='text-xl'>All Staffs</h2>
                <Link href='/admin/staffs/create'>
                    <Button type="primary" icon={<PlusOutlined />} >
                        Add New Staff
                    </Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={staffs}
                // onChange={onChange}
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

export default Staff