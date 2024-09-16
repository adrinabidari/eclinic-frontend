"use client";

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Table, Button, Space, Modal, Form, Input, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Staff from '../page';

const Medicine = () => {
    const [loading, setLoading] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [editingMedicine, setEditingMedicine] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [form] = Form.useForm();

    const getMedicines = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/all-medicines');
            setMedicines(response.data);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditingMedicine(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {

            const values = await form.validateFields();
            await axios.put(`/api/update-medicine/${editingMedicine.id}`, {
                name: values.name,
            });
            message.success('Medicine updated successfully!');
            getMedicines();
            setIsModalOpen(false);
            setEditingMedicine(null);
            setUpdating(false);
        } catch (error) {
            console.error(error);
            message.error('Failed to update medicine.');
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this medicine?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setUpdating(true); // Start loading spinner for delete
                    await axios.delete(`/api/delete-medicine/${id}`);
                    message.success('Medicine deleted successfully!');
                    getMedicines();
                } catch (error) {
                    console.error(error);
                    message.error('Failed to delete medicine.');
                } finally {
                    setUpdating(false); // Stop loading spinner
                }
            },
        });
    };

    useEffect(() => {
        getMedicines();
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
            <div className='flex justify-between mb-5'>
                <h2 className='text-xl'>All Medicines</h2>
                <Link href='/staff/medicines/create'>
                    <Button type="primary" icon={<PlusOutlined />} >
                        Add New Medicine
                    </Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={medicines}
                showSorterTooltip={{
                    target: 'sorter-icon',
                }}
                bordered={true}
                size='small'
                rowKey='id'
                loading={loading}
            />
            <Modal
                title="Edit Medicine"
                open={isModalOpen}
                onOk={handleUpdate}
                onCancel={() => setIsModalOpen(false)}
                okText="Update"
                cancelText="Cancel"
                okButtonProps={{ loading: updating }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={editingMedicine}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter the medicine name' }]}
                    >
                        <Input className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
                    </Form.Item>
                </Form>
            </Modal>
        </Staff>
    );
};

export default Medicine;
