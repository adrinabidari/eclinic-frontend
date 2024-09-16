"use client"

import Link from 'next/link'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, DatePicker, message, Form } from 'antd'
import { useState } from 'react'
import axios from '@/lib/axios'
import InputError from '@/components/InputError'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import Doctor from '../../page'

const AddHoliday = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [date, setDate] = useState();


    const onDatePicked = (date, dateString) => {
        setDate(dateString);
    };

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('date', date);
        formData.append('reason', values.reason);

        try {
            const response = await axios
                .post('/api/holiday-create', formData)
                .then(res => {
                    messageApi.open({
                        type: 'success',
                        content: 'New doctor created sucessfully',
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
        <Doctor>
            {contextHolder}

            <div className="">
                <div className="bg-white rounded-xl shadow p-4 sm:p-7">
                    <div className="mb-8 flex justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Add Holiday
                            </h2>
                            <p className="text-sm text-gray-600">
                                Fill the details below to add new holiday.
                            </p>
                        </div>
                        <div>
                            <Link href='/doctor/holidays'>
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

                            {/* Dob */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-sm text-gray-800 mt-2.5">
                                    Date
                                </label>
                            </div>

                            <div className="sm:col-span-9">
                                <Form.Item
                                    name="date"
                                    rules={[{ required: true, message: 'Please select the date for holiday' }]}

                                >
                                    <DatePicker className='w-full' onChange={onDatePicked}
                                        disabledDate={disabledDate}
                                    />
                                </Form.Item>
                            </div>
                            {/* End of dob */}


                            {/* Name section */}
                            <div className="sm:col-span-3">
                                <label className="inline-block text-gray-800 mt-2.5">
                                    Reason
                                </label>
                                <span className="text-sm text-gray-400">
                                    (Optional)
                                </span>
                            </div>

                            <div className="sm:col-span-9">
                                <Form.Item
                                    name="reason"
                                >
                                    <TextArea
                                        placeholder="Reason for holiday"
                                        autoSize={{ minRows: 2, maxRows: 6 }}
                                    />

                                </Form.Item>
                                <InputError messages={errors.name} className="mt-2" />
                            </div>
                            {/* End of Name section */}

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

export default AddHoliday;
