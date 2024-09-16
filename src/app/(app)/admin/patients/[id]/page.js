"use client"
import Link from 'next/link'
import Admin from '../../page'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, DatePicker, Radio, message, Form, Input, Spin } from 'antd'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import dayjs from 'dayjs'

const PatientDetails = ({ params }) => {
    const id = params.id;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [Update, setUpdate] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [patient, setPatient] = useState(null);

    const getPatient = async () => {
        setLoading(true);
        try {
            await axios.get(`/api/patient-detail/`, {
                params: {
                    id: id
                }
            })
                .then(res => {
                    setPatient(res.data)
                    setLoading(false);

                    form.setFieldsValue({ name: res.data.user.name });
                    form.setFieldsValue({ email: res.data.user.email });
                    form.setFieldsValue({ address: res.data.address });
                    form.setFieldsValue({ phone: res.data.contact });
                    form.setFieldsValue({ dob: res.data.dob ? dayjs(res.data.dob) : null });
                    form.setFieldsValue({ gender: res.data.gender });
                })
                .catch(error => {
                    console.error('Failed to load patient:', error);
                    setLoading(false);
                });
        } catch (e) {
            console.log(e);
            setLoading(false);

        }
    }

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('address', values.address);
        formData.append('phone', values.phone);
        formData.append('dob', dayjs(values.dob).format('YYYY-MM-DD'));
        formData.append('gender', values.gender);

        try {
            setUpdate(true);
            const response = await axios
                .post('/api/patient-edit', formData)
                .then(res => {
                    messageApi.open({
                        type: 'success',
                        content: 'Patient edited sucessfully',
                    });
                    setUpdate(false);
                })
                .catch(error => {
                    console.log(error.response);
                    setUpdate(false);
                    messageApi.open({
                        type: 'error',
                        content: 'Something went wrong',
                    });
                });
        } catch (e) {
            console.log(e);
            setUpdate(false);
        }
    }

    useEffect(() => {
        if (id) {
            getPatient();
        }
    }, [id]);

    if (loading) {
        return (<Admin> <Spin /></Admin>);
    }

    if (!patient) {
        return (
            <Admin>
                <p>No patient found.</p>
            </Admin>
        );
    }

    return (
        <Admin>
            {contextHolder}

            <div className="">
                <div className="bg-white rounded-xl shadow p-4 sm:p-7">
                    <div className="mb-8 flex justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Edit Patient
                            </h2>
                            <p className="text-sm text-gray-600">
                                Fill the details below to edit patient.
                            </p>
                        </div>
                        <div>
                            <Link href='/admin/patients/'>
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
                            {/* Name section */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-gray-800 mt-2.5">
                                    Full name
                                </label>
                            </div>

                            <div className="sm:col-span-9">
                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: 'Please enter the full name' }]}
                                >
                                    <Input
                                        id="af-account-full-name"
                                        type="text"
                                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        placeholder="Nishant Gisbert"
                                    />
                                </Form.Item>
                            </div>
                            {/* End of Name section */}

                            {/* Email section */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Email
                                </label>
                            </div>

                            <div className="sm:col-span-9">
                                <Form.Item
                                    name="email"
                                    rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
                                >
                                    <Input
                                        id="af-account-email"
                                        type="email"
                                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        placeholder="nishantgisbert@eclinicnexus.com"
                                    />
                                </Form.Item>
                            </div>
                            {/* End of Email section */}

                            {/* Address Section */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Address
                                </label>
                            </div>

                            <div className="sm:col-span-9">
                                <Form.Item
                                    name="address"
                                    rules={[{ required: true, message: 'Please enter the address' }]}
                                >
                                    <Input
                                        id="af-account-address"
                                        type="text"
                                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        placeholder="Maitidevi, Kathmandu"
                                    />
                                </Form.Item>
                            </div>
                            {/* End of Address section */}

                            {/* Phone section */}
                            <div className="sm:col-span-3">
                                <div className="inline-block">
                                    <label className="inline-block text-sm text-gray-800 mt-2.5">
                                        Phone
                                    </label>
                                    <span className="text-sm text-gray-400">
                                        (Optional)
                                    </span>
                                </div>
                            </div>
                            <div className="sm:col-span-9">
                                <Form.Item
                                    name="phone"
                                    rules={[{ message: 'Please enter a valid phone number' }]}
                                >
                                    <Input
                                        id="af-account-phone"
                                        type="text"
                                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        placeholder="(+977) xxxxxxxxxx"
                                    />
                                </Form.Item>
                            </div>
                            {/* End of phone section */}

                            {/* Dob */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Date Of Birth
                                </label>
                            </div>

                            <div className="sm:col-span-3">
                                <Form.Item
                                    name="dob"
                                    rules={[{ required: true, message: 'Please select your date of birth' }]}
                                >
                                    <DatePicker className='w-full' />
                                </Form.Item>
                            </div>
                            {/* End of dob */}

                            {/* Gender */}
                            <div className="sm:col-span-1">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Gender
                                </label>
                            </div>

                            <div className="sm:col-span-5"><Form.Item
                                name="gender"
                                rules={[{ required: true, message: 'Please select your gender' }]}
                                initialValue="M"  // Sets 'Male' as the default selected value
                            >
                                <Radio.Group className='flex'>
                                    <Radio value='M' className="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none m-0">
                                        Male
                                    </Radio>
                                    <Radio value='F' className="flex py-2 px-3 w-full border border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none m-0">
                                        Female
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>

                            </div>
                            {/* End of gender */}
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex justify-end gap-x-2">
                            <Button onClick={() => form.resetFields()}>
                                Cancel
                            </Button>

                            <Button type="primary" htmlType="submit" loading={Update}>
                                Update
                            </Button>
                        </div>
                        {/* End of actions */}
                    </Form>
                </div>
            </div>
        </Admin>
    )
}

export default PatientDetails;
