"use client";

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Table, Button, Space, Modal, Form, Input, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Admin from '../page';

const Specialization = () => {
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [editingService, setEditingService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [form] = Form.useForm();

    // method for getting servie options
    const getServices = async () => {
        setLoading(true);
        try {
            const response = await axios
                .get('/api/all-services')
                .then(res => {
                    setLoading(false);
                    console.log(res.data);
                    setServices(res.data);
                })
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }

    const handleEdit = (record) => {
        setEditingService(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const values = await form.validateFields();
            await axios.put(`/api/update-service/${editingService.id}`, {
                service: values.service,
                charge: values.charge
            });
            message.success('Service updated successfully!');
            getServices();
            setIsModalOpen(false);
            setEditingService(null);
            setUpdating(false);
        } catch (error) {
            console.error(error);
            message.error('Failed to update Service.');
            setUpdating(false);
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this service?',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setUpdating(true); // Start loading spinner for delete
                    await axios.delete(`/api/delete-service/${id}`);
                    message.success('Service deleted successfully!');
                    getServices();
                } catch (error) {
                    console.error(error);
                    message.error('Failed to delete service.');
                } finally {
                    setUpdating(false); // Stop loading spinner
                }
            },
        });
    };

    useEffect(() => {
        getServices();
    }, []);

    const columns = [
        {
            title: 'S.No.',
            dataIndex: 'id',
        },
        {
            title: 'Service',
            dataIndex: 'service',
        },
        {
            title: 'Service Charge',
            dataIndex: 'charge',
            render: (charge) => {
                return <>Rs. {charge}</>
            }
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
        <Admin>
            <div className='flex justify-between mb-5'>
                <h2 className='text-xl'>All Services</h2>
                <Link href='/staff/services/create'>
                    <Button type="primary" icon={<PlusOutlined />} >
                        Add New Service
                    </Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={services}
                showSorterTooltip={{
                    target: 'sorter-icon',
                }}
                bordered={true}
                size='small'
                rowKey='id'
                loading={loading}
            />
            <Modal
                title="Edit Service"
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
                    initialValues={editingService}
                >
                    {/* Service Name */}
                    <Form.Item
                        name="service"
                        label="Service"
                        rules={[{ required: true, message: 'Please enter the service name' }]}
                    >
                        <Input className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" />
                    </Form.Item>
                    {/* End of service name */}

                    {/* Service Charge */}
                    <Form.Item
                        name="charge"
                        label="Service Charge"
                        rules={[{ required: true, message: 'Please enter service charge' }]}
                    >
                        <Input
                            type="number"
                            placeholder="Additional fees"
                            prefix='Rs.'
                        />
                    </Form.Item>
                    {/* End of service charge */}
                </Form>
            </Modal>
        </Admin>
    );
};

export default Specialization;
