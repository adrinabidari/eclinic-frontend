"use client"

import Link from 'next/link'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, message, Form, Input } from 'antd'
import { useState } from 'react'
import axios from '@/lib/axios'
import Doctor from '../../page'

const AddService = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('service', values.service);
        formData.append('charge', values.charge);

        try {
            const response = await axios
                .post('/api/service-create', formData)
                .then(res => {
                    messageApi.open({
                        type: 'success',
                        content: 'New Service created sucessfully',
                    });
                    form.resetFields()
                    setLoading(false);
                })
        } catch (e) {
            console.log(e);
            messageApi.open({
                type: 'error',
                content: 'Something went wrong',
            });
            setLoading(false);
        }
    }

    return (
        <Doctor>
            {contextHolder}

            <div className="">
                <div className="bg-white rounded-xl shadow p-4 sm:p-7">
                    <div className="mb-8 flex justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Add Service
                            </h2>
                            <p className="text-sm text-gray-600">
                                Fill the details below to add new service.
                            </p>
                        </div>
                        <div>
                            <Link href='/admin/services'>
                                <Button type="primary" icon={<ArrowLeftOutlined />} >
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                            {/* Service */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Service
                                </label>
                            </div>

                            <div className="sm:col-span-9">
                                <Form.Item
                                    name="service"
                                    rules={[{ required: true, message: 'Please enter the service name' }]}
                                >
                                    <Input
                                        type="text"
                                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        placeholder="Enter the Service"
                                    />
                                </Form.Item>
                            </div>
                            {/* End of service */}

                            {/* Charge */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Charge
                                </label>
                            </div>

                            <div className="sm:col-span-9">
                                <Form.Item
                                    name="charge"
                                    rules={[{ required: true, message: 'Please enter the charge' }]}
                                >
                                    <Input
                                        type="number"
                                        placeholder="Service charge"
                                        prefix='Rs.'
                                    />
                                </Form.Item>
                            </div>
                            {/* End of charge */}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex justify-end gap-x-2">
                            <Button onClick={() => form.resetFields()}>
                                Cancel
                            </Button>

                            <Button type="primary" htmlType="submit" loading={loading}>
                                Save
                            </Button>
                        </div>
                        {/* End of actions */}
                    </Form>
                </div>
            </div>
        </Doctor>
    )
}

export default AddService;
