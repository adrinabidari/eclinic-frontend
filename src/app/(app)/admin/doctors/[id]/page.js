"use client";
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Button, DatePicker, Form, Input, message, Radio, Select, Spin, Switch } from 'antd';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Admin from '../../page';
import dayjs from 'dayjs';

const DoctorDetails = ({ params }) => {
    const id = params.id;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [allSpecialization, setAllSpecialization] = useState([]);
    const [doctor, setDoctor] = useState(null);

    const getSpecialization = async () => {
        try {
            const response = await axios
                .get('/api/all-specialization')
                .then(res => {
                    setAllSpecialization(res.data.map((specialization) => ({
                        label: specialization.name,
                        value: specialization.id,
                    })));
                })
                .catch(error => { });
        } catch (e) {
            console.log(e);
        }
    }

    const getDocotr = async () => {
        try {
            await axios.get(`/api/doctor-detail/`, {
                params: {
                    id: id
                }
            })
                .then(res => {
                    setDoctor(res.data);
                    setLoading(false);
                    console.log(res.data)

                    form.setFieldsValue({ name: res.data.user.name });
                    form.setFieldsValue({ email: res.data.user.email });
                    form.setFieldsValue({ address: res.data.address });
                    form.setFieldsValue({ phone: res.data.contact });
                    form.setFieldsValue({ dob: res.data.dob ? dayjs(res.data.dob) : null });
                    form.setFieldsValue({ gender: res.data.gender });
                    form.setFieldsValue({ specialization: res.data.specialization_id });
                    form.setFieldsValue({ status: res.data.status });
                })
                .catch(error => {
                    console.error('Failed to load appointment:', error);
                    setLoading(false);
                });
        } catch (e) {
            console.log(e);

        }
    }


    const handleSubmit = async (values) => {
        setLoading(true);
        console.log(values);

        const formData = new FormData();
        formData.append('id', id);
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('address', values.address);
        formData.append('phone', values.phone);
        formData.append('dob', dayjs(values.dob).format('YYYY-MM-DD'));
        formData.append('gender', values.gender);
        formData.append('specialization', values.specialization);

        try {
            const response = await axios
                .post('/api/doctor-edit',
                    formData
                )
                .then(res => {
                    messageApi.open({
                        type: 'success',
                        content: 'Profile edited sucessfully',
                    });
                    setLoading(false);
                })
                .catch(error => {
                    setLoading(false);
                    messageApi.open({
                        type: 'error',
                        content: 'Something went wrong',
                    });
                });
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    }


    useEffect(() => {
        getSpecialization();
        if (id) {
            getDocotr();
        }
    }, [id]);

    if (loading) {
        return (<Admin> <Spin /></Admin>);
    }

    if (!doctor) {
        return (
            <Admin>
                <p>No doctor found.</p>
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
                                Edit Doctor
                            </h2>
                            <p className="text-sm text-gray-600">
                                Fill the details below to edit doctor.
                            </p>
                        </div>
                        <div>
                            <Link href='/admin/doctors/'>
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

                            <div className="sm:col-span-5">
                                <Form.Item
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

                            {/* Specialization */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Specialization
                                </label>
                            </div>

                            <div className="sm:col-span-3">
                                <Form.Item
                                    name="specialization"
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select specialization"
                                        optionFilterProp="label"
                                        options={allSpecialization}
                                        className='w-full'
                                    />
                                </Form.Item>
                            </div>
                            {/* End of Specialization */}

                            {/* Status */}
                            <div className="sm:col-span-1">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Status
                                </label>
                            </div>

                            <div className="sm:col-span-3">
                                <Form.Item
                                    name="status"
                                    valuePropName="checked"
                                    initialValue={true}
                                >
                                    <Switch />
                                </Form.Item>
                            </div>
                        </div>
                        {/* End of status */}

                        {/* Actions */}
                        <div className="mt-4 flex justify-end gap-x-2">
                            <Button onClick={() => form.resetFields()}>
                                Cancel
                            </Button>

                            <Button type="primary" htmlType="submit" loading={loading}>
                                Update
                            </Button>
                        </div>
                        {/* End of actions */}
                    </Form>
                </div>
            </div>
        </Admin >
    );
}

export default DoctorDetails;
