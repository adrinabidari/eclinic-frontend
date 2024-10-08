"use client";

import React, { useState, useEffect } from 'react';
import { Button, Calendar, Card, Tag } from 'antd';
import axios from '@/lib/axios';
import Link from 'next/link';
import { BorderlessTableOutlined, PlusOutlined } from '@ant-design/icons';
import Patient from '../page';

// Function to get the list of events for a specific date
const getListData = (value, appointments) => {
    const dateStr = value.format('YYYY-MM-DD'); // Format the date to match the appointment date format
    const listData = appointments
        .filter(appointment => appointment.date === dateStr) // Filter appointments by date
        .map(appointment => {
            let color = 'purple'; // Default type
            // Customize the type based on appointment status or other criteria
            if (appointment.status === 'check-in') color = 'green';
            if (appointment.status === 'check-out') color = 'yellow';
            if (appointment.status === 'cancelled') color = 'red';

            return {
                color,
                content: ` (${appointment.time_slot.start_time} - ${appointment.time_slot.end_time}) - ${appointment.service.service} - ${appointment.patient.name}`,
            };
        });

    return listData || [];
};

// Function to render the content for each date cell
const dateCellRender = (value, appointments) => {
    const listData = getListData(value, appointments);
    return (
        <ul className="events">
            {listData.map((item) => (
                <li key={item.content}>
                    <Tag color={item.color}>
                        {item.content}
                    </Tag>
                </li>
            ))}
        </ul>
    );
};

// Main component for the appointment calendar view
const AppointmentCalendarView = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to fetch appointments from the API
    const getAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/all-appointments');
            setAppointments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getAppointments();
    }, []);

    return (
        <Patient>
            <div className='flex justify-between mb-5'>
                <h2 className='text-xl'>All Appointments</h2>
                <div>
                    <Link href='/patient/appointments'>
                        <Button type="dashed" icon={<BorderlessTableOutlined />} >
                            Switch to Regular view
                        </Button>
                    </Link>

                    <Link href='/patient/appointments/create' className='ml-3'>
                        <Button type="primary" icon={<PlusOutlined />} >
                            Add New Appointment
                        </Button>
                    </Link>
                </div>
            </div>
            <Card>
                <Calendar cellRender={(current) => dateCellRender(current, appointments)} loading={loading} />
            </Card>
        </Patient>
    );
}

export default AppointmentCalendarView;
