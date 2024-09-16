"use client";
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Button, message, Spin, Tag } from 'antd';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Admin from '../../page';

const TransactionDetails = ({ params }) => {
    const id = params.id;
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`/api/appointments/${id}`)
                .then(response => {
                    setAppointment(response.data);
                    setLoading(false);
                    console.log(response.data)
                })
                .catch(error => {
                    console.error('Failed to load appointment:', error);
                    setError('Failed to load appointment');
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (<Admin> <Spin /></Admin>);
    }

    if (error) {
        return (
            <Admin>
                <p>{error}</p>
            </Admin>
        );
    }

    if (!appointment) {
        return (
            <Admin>
                <p>No transactions found.</p>
            </Admin>
        );
    }

    return (

        < Admin >
            <div className="bg-white rounded-xl shadow p-4 sm:p-7">
                <div className="mb-8 flex justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Transaction Details
                        </h2>
                    </div>
                    <div>
                        <Link href='/staff/transactions/' className='ml-3'>
                            <Button type="primary" icon={<ArrowLeftOutlined />} >
                                Back
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                    {/* start of 1st row */}
                    <div className="sm:col-span-6">
                        <label className="inline-block mt-2.5">
                            Appointment id:
                        </label>
                        <div className='text-gray-500'>
                            <Tag color='yellow'>
                                {appointment.id}
                            </Tag>
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label className="inline-block mt-2.5">
                            Appointment At:
                        </label>
                        <div className='text-gray-500'>
                            <Tag color='blue'>
                                {appointment.date} {appointment.time_slot.start_time} - {appointment.time_slot.end_time}
                                {/* 20 Aug 2024 12:00 AM - 12:30 AM */}
                            </Tag>
                        </div>
                    </div>
                    {/* end of 1st row */}

                    {/* start of 2nd row */}
                    <div className="sm:col-span-6">
                        <label className="inline-block mt-2.5">
                            Status:
                        </label>
                        <div className='text-gray-500'>
                            {appointment.status}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label className="inline-block mt-2.5">
                            Patient:
                        </label>
                        <div className='text-gray-500'>
                            {appointment.patient.name}
                        </div>
                    </div>
                    {/* end of 2nd row */}

                    {/* start of 3rd row */}
                    <div className="sm:col-span-6">
                        <label className="inline-block mt-2.5">
                            Doctor:
                        </label>
                        <div className='text-gray-500'>
                            {appointment.doctor.name}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label className="inline-block mt-2.5">
                            Service:
                        </label>
                        <div className='text-gray-500'>
                            {appointment.service.service}
                        </div>
                    </div>
                    {/* end of 3rd row */}

                    {/* start of 4th row */}
                    <div className="sm:col-span-6">
                        <label className="inline-block mt-2.5">
                            Amount:
                        </label>
                        <div className='text-gray-500'>
                            {appointment.total_amount}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label className="inline-block mt-2.5">
                            Payment:
                        </label>
                        <div className='text-gray-500'>
                            {appointment.payment ? "Paid" : "Not paid"}
                        </div>
                    </div>
                    {/* end of 4th row */}
                </div>

            </div>
        </Admin >
    );
}

export default TransactionDetails;
