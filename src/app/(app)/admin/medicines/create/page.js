"use client"

import Link from 'next/link'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, message, Form, Input } from 'antd'
import { useState } from 'react'
import axios from '@/lib/axios'
import Admin from '../../page'

const AddMedicine = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', values.name);

        try {
            const response = await axios
                .post('/api/medicine-create', formData)
                .then(res => {
                    messageApi.open({
                        type: 'success',
                        content: 'New medicine created sucessfully',
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
        <Admin>
            {contextHolder}

            <div className="">
                <div className="bg-white rounded-xl shadow p-4 sm:p-7">
                    <div className="mb-8 flex justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Add Medicine
                            </h2>
                            <p className="text-sm text-gray-600">
                                Fill the details below to add new medicine.
                            </p>
                        </div>
                        <div>
                            <Link href='/admin/medicines'>
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
                            {/* Name */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Name
                                </label>
                            </div>

                            <div className="sm:col-span-9">
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: 'Please enter the medicine' }]}
                                >
                                    <Input
                                        type="text"
                                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        placeholder="Enter the medicine"
                                    />
                                </Form.Item>
                            </div>
                            {/* End of name */}

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
        </Admin>
    )
}

export default AddMedicine;
