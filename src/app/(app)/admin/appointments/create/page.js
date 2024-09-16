"use client"

import Link from 'next/link'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, DatePicker, Select, message, Form, Input, Card, Tag, Empty } from 'antd'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
import { useAuth } from '@/hooks/auth'
import TextArea from 'antd/es/input/TextArea'
import Admin from '../../page'

const AddAppointment = () => {
    const [form] = Form.useForm();

    const [allServices, setAllServices] = useState([]);
    const [allPatients, setAllPatients] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentDay, setAppointmentDay] = useState();
    const [timeSlots, settimeSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [gettingTimeSlot, setGettingTimeSlot] = useState(false);


    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().startOf('day');
    };

    const onDatePicked = (date, dateString) => {
        setAppointmentDay(date.$W + 1);
        setAppointmentDate(dateString);
    };

    useEffect(() => {
        if (appointmentDate) {
            getTimeSlots();
        }
    }, [appointmentDate]);


    const getTimeSlots = async () => {
        setGettingTimeSlot(true);
        try {
            const response = await axios.get('/api/doctor-time-slots', {
                params: {
                    doctor_id: form.getFieldValue('doctor'),
                    date: appointmentDate,
                    day: appointmentDay,
                }
            })
                .then(res => {
                    // console.log(res.data);
                    if (res.data.message == 'not-available') {
                        setGettingTimeSlot(false);
                        settimeSlots([]);
                    } else {
                        console.log(res.data);
                        settimeSlots(res.data.data);
                        setBookedSlots(res.data.booked.map((booking) => booking.time_slot.id));
                        setGettingTimeSlot(false);
                    }

                })
                .catch(e => {
                    setGettingTimeSlot(false);
                });
        } catch (e) {
            console.log(e);
            setGettingTimeSlot(false);
        }
    }

    // method when service is selected
    const serviceSelected = (value) => {
        const selectedService = allServices.find(service => service.value === value);
        console.log(selectedService);
        if (selectedService) {
            form.setFieldsValue({ amount: selectedService.charge });
        }

        calculateTotalAmount();
    }

    // method when payment method is selected
    const handleChangeForPayment = (value) => {
        form.setFieldsValue({ payment_method: value });
    }

    // method to calculate total amount payable
    const calculateTotalAmount = () => {
        const amount = Number(form.getFieldValue('amount')) || 0; // Default to 0 if undefined
        const addFees = Number(form.getFieldValue('add_fees')) || 0; // Default to 0 if undefined

        // Calculate the total amount
        const totalAmount = amount + addFees;

        // Set the total amount back to the form
        form.setFieldsValue({ total_amount: totalAmount });
    }

    // method for getting servie options
    const getServices = async () => {
        try {
            const response = await axios
                .get('/api/all-services')
                .then(res => {
                    console.log(res.data);
                    setAllServices(res.data.map((service) => ({
                        label: service.service,
                        value: service.id,
                        charge: service.charge,
                    })));
                })
                .catch(error => { });
        } catch (e) {
            console.log(e);
        }
    }

    // method for getting all patients
    const getPatients = async () => {
        try {
            const response = await axios
                .get('/api/all-patients')
                .then(res => {
                    // console.log(res.data);
                    setAllPatients(res.data.map((patient) => ({
                        label: patient.user.name,
                        value: patient.user_id,
                    })));
                })
                .catch(error => { });
        } catch (e) {
            console.log(e);
        }
    }

    // method for getting all doctors
    const getDoctors = async () => {
        try {
            const response = await axios
                .get('/api/doctors')
                .then(res => {
                    setAllDoctors(res.data.map((doctor) => ({
                        label: doctor.user.name,
                        value: doctor.user_id,
                    })));
                })
                .catch(error => { });
        } catch (e) {
            console.log(e);
        }
    }

    const handleTagClick = (slot) => {
        if (!bookedSlots.includes(slot.id)) { // Prevent selection of booked slots
            setSelectedSlot(slot.id === selectedSlot ? null : slot.id);
            form.setFieldsValue({ slot: slot.id === selectedSlot ? null : slot.id });
        }

    };

    useEffect(() => {
        getServices();
        getPatients();
        getDoctors();
    }, [])

    const handleSubmit = async (values) => {
        setLoading(true);

        const formData = new FormData();
        formData.append('date', appointmentDate);
        formData.append('day', appointmentDay);
        formData.append('service_id', values.service);
        formData.append('patient_id', values.patient);
        formData.append('time_slot_id', values.slot);
        formData.append('desc', values.desc);
        formData.append('payment_method', values.payment_method);
        formData.append('amount', values.amount);
        formData.append('add_fees', values.add_fees);
        formData.append('total_amount', values.total_amount);
        formData.append('doctor_id', values.doctor);

        try {
            const response = await axios
                .post('/api/appointment-create',
                    formData,
                )
                .then(res => {
                    messageApi.open({
                        type: 'success',
                        content: 'New appointment created sucessfully',
                    });
                    form.resetFields();
                    settimeSlots([]);
                    setBookedSlots([]);
                    setLoading(false);
                })
                .catch(error => {
                    console.log(error.response);
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
                                Add Appointment
                            </h2>
                            <p className="text-sm text-gray-600">
                                Fill the details below to add new appointment.
                            </p>
                        </div>
                        <div>
                            <Link href='/admin/appointments/'>
                                <Button type="primary" icon={<ArrowLeftOutlined />} >
                                    Back
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Form
                        layout='vertical'
                        form={form}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            style={{
                                margin: '0 0'
                            }}
                        >
                            {/* Doctor */}
                            <Form.Item
                                name="doctor"
                                label="Doctor"
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                }}
                                rules={[{ required: true, message: 'Please select the doctor' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select the Doctor"
                                    optionFilterProp="label"
                                    options={allDoctors}
                                    className='w-full'
                                />
                            </Form.Item>
                            {/* End of Doctor */}

                            {/* Appointment date */}
                            <Form.Item
                                name="date"
                                label="Appointment Date"
                                rules={[{ required: true, message: 'Please select the date of appointment' }]}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    margin: '0 8px',
                                }}
                            >
                                <DatePicker className='w-full' onChange={onDatePicked} disabledDate={disabledDate} placeholder='Select the date of appointment' />
                            </Form.Item>
                            {/* End of Appointment date */}

                        </Form.Item>


                        <Form.Item
                            style={{
                                margin: '0 0'
                            }}
                        >
                            {/* Service */}
                            <Form.Item
                                name="service"
                                label="Service"
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                }}
                                rules={[{ required: true, message: 'Please select the service' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select the service"
                                    optionFilterProp="label"
                                    options={allServices}
                                    className='w-full'
                                    onChange={serviceSelected}
                                />
                            </Form.Item>
                            {/* End of Service */}

                            {/* Patient */}
                            <Form.Item
                                name="patient"
                                label="Patient"
                                rules={[{ required: true, message: 'Please select the patient' }]}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    margin: '0 8px',
                                }}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select the patient"
                                    optionFilterProp="label"
                                    options={allPatients}
                                    className='w-full'
                                />
                            </Form.Item>
                            {/* End of Patient */}
                        </Form.Item>

                        {/* Time Slots */}
                        <label className="text-gray-800 mt-2.5 flex">
                            Available Slots
                            <div className='ml-2 flex'>
                                <span className="h-5 w-5 bg-red-200 rounded-full border border-red-400"></span>
                                <label className="text-gray-400 ml-1">
                                    Booked Up
                                </label>
                            </div>
                            <div className='ml-2 flex'>
                                <span className="h-5 w-5 bg-slate-200 rounded-full border border-slate-400"></span>
                                <label className="text-gray-400 ml-1">
                                    Available
                                </label>
                            </div>
                        </label>

                        <Form.Item
                            name="slot"
                            rules={[{ required: true, message: 'Please select the time slot' }]}
                        >
                            <Card loading={gettingTimeSlot} className='my-3'>
                                {timeSlots.length > 0 ? (
                                    timeSlots.map((slot) => (
                                        <Tag
                                            color={slot.id === selectedSlot ? "blue" : bookedSlots.includes(slot.id) ? "red" : "default"}
                                            key={slot.id}
                                            onClick={() => handleTagClick(slot)}
                                            style={{
                                                cursor: bookedSlots.includes(slot.id) ? 'not-allowed' : 'pointer',
                                                fontSize: '13px',
                                                padding: '10px 20px',
                                                lineHeight: '14px'
                                            }}
                                        >
                                            {slot.start_time} - {slot.end_time}
                                        </Tag>
                                    ))
                                ) : (
                                    <Empty description="No time periods were found" />
                                )}
                            </Card>
                        </Form.Item>
                        {/* End of Time slots */}

                        {/* Description */}
                        <Form.Item
                            name="desc"
                            label="Description"
                        >
                            <TextArea placeholder="Enter the description" autoSize />
                        </Form.Item>
                        {/* End of Description */}

                        <Form.Item
                            style={{
                                margin: '0 0'
                            }}
                        >
                            {/* Payment method */}
                            <Form.Item
                                name="payment_method"
                                label="Payment method"
                                rules={[{ required: true, message: 'Please select the methodd for payment' }]}
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                }}
                            >
                                <Select
                                    placeholder="Select a payment method"
                                    onChange={handleChangeForPayment}
                                    options={[
                                        {
                                            value: 'manually',
                                            label: 'Manually',
                                        },
                                        {
                                            value: 'bank',
                                            label: 'Bank',
                                        },
                                        {
                                            value: 'digital_wallet',
                                            label: 'Digital Wallet',
                                        },
                                    ]}
                                />
                            </Form.Item>
                            {/* End of Payment method */}

                            {/* Amount */}
                            <Form.Item
                                name="amount"
                                label="Amount"
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    margin: '0 8px',
                                }}
                                rules={[{ required: true, message: 'Please enter the amount' }]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    prefix='Rs.'
                                    disabled
                                />
                            </Form.Item>
                            {/* End of Amount */}
                        </Form.Item>

                        <Form.Item
                            style={{
                                margin: '0 0'
                            }}
                        >
                            {/* Additional Fees */}
                            <Form.Item
                                name="add_fees"
                                label="Additional Fees"
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                }}
                            >
                                <Input
                                    type="number"
                                    placeholder="Additional fees"
                                    prefix='Rs.'
                                    onChange={calculateTotalAmount}
                                />
                            </Form.Item>
                            {/* End of Additional Fees */}

                            {/* Total amount payable */}
                            <Form.Item
                                name="total_amount"
                                label="Total amount payable"
                                style={{
                                    display: 'inline-block',
                                    width: 'calc(50% - 8px)',
                                    margin: '0 8px',
                                }}
                                rules={[{ required: true, message: 'Please enter the total amount payable' }]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Total amount payable"
                                    prefix='Rs.'
                                    disabled
                                />
                            </Form.Item>
                            {/* End of Total amount payable */}
                        </Form.Item>

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

export default AddAppointment;
