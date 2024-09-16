"use client";

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Table, Button, Space, Modal, Form, Input, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Staff from '../page';

const Specialization = () => {
    const [loading, setLoading] = useState(false);
    const [specializations, setSpecializations] = useState([]);
    const [editingSpecialization, setEditingSpecialization] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();


    const [form] = Form.useForm();

    const getSpecializations = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/all-specialization');
            setSpecializations(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditingSpecialization(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {

            const values = await form.validateFields();
            await axios.put(`/api/update-specialization/${editingSpecialization.id}`, {
                name: values.name,
            });
            messageApi.success('Specialization updated successfully!');
            getSpecializations();
            setIsModalOpen(false);
            setEditingSpecialization(null);
            setUpdating(false);
        } catch (error) {
            console.error(error);
            messageApi.error('Failed to update specialization.');
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this specialization?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setUpdating(true); // Start loading spinner for delete
                    await axios.delete(`/api/delete-specialization/${id}`);
                    message.success('Specialization deleted successfully!');
                    getSpecializations();
                } catch (error) {
                    console.error(error);
                    message.error('Failed to delete specialization.');
                } finally {
                    setUpdating(false); // Stop loading spinner
                }
            },
        });
    };

    useEffect(() => {
        getSpecializations();
    }, []);

    const columns = [
        {
            title: 'S.No.',
            dataIndex: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        onClick={() => handleEdit(record)}
                        shape="circle"
                        icon={<EditOutlined />}
                    />
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

    return (
        <Staff>
            {contextHolder}

            <div className='flex justify-between mb-5'>
                <h2 className='text-xl'>All Specializations</h2>
                <Link href='/staff/specializations/create'>
                    <Button type="primary" icon={<PlusOutlined />} >
                        Add New Specialization
                    </Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={specializations}
                showSorterTooltip={{
                    target: 'sorter-icon',
                }}
                bordered={true}
                size='small'
                rowKey='id'
                loading={loading}
            />
            <Modal
                title="Edit Specialization"
                open={isModalOpen}
                onOk={handleUpdate}
                onCancel={() => setIsModalOpen(false)}
                okText="Update"
                cancelText="Cancel"
                okButtonProps={{ loading: updating }} // Pass the loading state to the OK button
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={editingSpecialization}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the specialization name' }]}
                    >
                        <Input className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
                    </Form.Item>
                </Form>
            </Modal>
        </Staff>
    );
};

export default Specialization;
