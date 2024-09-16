"use client"
import Link from 'next/link'
import Admin from '../../page'
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Select, message, Form, Input, Upload } from 'antd'
import { useState } from 'react'
import axios from '@/lib/axios'
import InputError from '@/components/InputError'
import ImgCrop from 'antd-img-crop'

const AddStaff = () => {
    const [form] = Form.useForm(); // Create form instance for validation
    const [roles, setRoles] = useState([
        { value: process.env.NEXT_PUBLIC_STAFF_ID, label: 'Staff' },
        { value: process.env.NEXT_PUBLIC_ADMIN_ID, label: 'Admin' },
    ]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [profilefile, setProfilefile] = useState();
    const [messageApi, contextHolder] = message.useMessage();

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const onUploadChange = ({ fileList: newFileList }) => {
        setProfilefile(newFileList);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        setErrors([]);

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);
        formData.append('password_confirmation', values.passwordconfirm);
        formData.append('role_id', values.role);

        if (profilefile && profilefile.length > 0) {
            formData.append('image', profilefile[0].originFileObj);
        }
        try {
            const response = await axios
                .post('/api/staff-create',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                .then(res => {
                    messageApi.open({
                        type: 'success',
                        content: 'New staff created sucessfully',
                    });
                    form.resetFields()
                    setLoading(false);
                })
                .catch(error => {
                    console.log(error.response.data.errors);
                    setErrors(error.response.data.errors);
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

    return (
        <Admin>
            {contextHolder}

            <div className="">
                <div className="bg-white rounded-xl shadow p-4 sm:p-7">
                    <div className="mb-8 flex justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Add Staff
                            </h2>
                            <p className="text-sm text-gray-600">
                                Fill the details below to add new staff.
                            </p>
                        </div>
                        <div>
                            <Link href='/admin/staffs/'>
                                <Button type="primary" icon={<ArrowLeftOutlined />} >
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit} // Ant Design handles validation here
                    >
                        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Profile photo
                                </label>
                                <span className="text-sm text-gray-400">
                                    (Optional)
                                </span>
                            </div>

                            <div className="sm:col-span-9">
                                <div className="flex items-center gap-5">
                                    <div className="flex gap-x-2">
                                        <div>
                                            <Form.Item
                                                name="upload"
                                                valuePropName="fileList"
                                                getValueFromEvent={normFile}
                                            >
                                                <ImgCrop rotationSlider>
                                                    <Upload name="logo" listType="picture" maxCount={1} onPreview={onPreview} onChange={onUploadChange}>
                                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                                    </Upload>
                                                </ImgCrop>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                <InputError messages={errors.name} className="mt-2" />
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
                                <InputError messages={errors.email} className="mt-2" />
                            </div>
                            {/* End of Email section */}


                            {/* Password Section */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Password
                                </label>
                            </div>

                            <div className="sm:col-span-9">
                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Please enter a password' }]}
                                >
                                    <Input
                                        id="af-account-password"
                                        type="password"
                                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        placeholder="Enter new password"
                                    />
                                </Form.Item>
                                <InputError messages={errors.password} className="mt-2" />
                                <Form.Item
                                    name="passwordconfirm"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Please confirm your password' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Passwords do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        type="password"
                                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                        placeholder="Confirm password"
                                    />
                                </Form.Item>
                            </div>
                            {/* End of password section */}


                            {/* Roles */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Role
                                </label>
                            </div>

                            <div className="sm:col-span-3">
                                <Form.Item
                                    name="role"
                                    rules={[{ required: true, message: 'Please enter a role' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Select role"
                                        optionFilterProp="label"
                                        options={roles}
                                        className='w-full'
                                    />
                                </Form.Item>
                                <InputError messages={errors.name} className="mt-2" />
                            </div>
                            {/* End of Roles */}

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

export default AddStaff;
