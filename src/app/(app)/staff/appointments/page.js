"use client"
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Table, Button, Space, Tag } from "antd";
import { CalendarOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Staff from '../page';

// Helper function to compare dates
const compareDates = (a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
};

const columns = [
    {
        title: 'Doctor',
        dataIndex: ['doctor'],
        showSorterTooltip: {
            target: 'full-header',
        },
        sorter: (a, b) => a.user.name.localeCompare(b.user.name),
        render: (doctor) => {
            return (
                <div className='flex items-center'>
                    <img
                        src={process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/' + (doctor.profile != null ? doctor.profile : 'images/placeholder.jpg')}
                        width={30}
                        height={30}
                        className='rounded-full ring-2 ring-white'
                    />

                    <span className='ml-2'>{doctor.name}</span>
                </div>
            );
        },
    },
    {
        title: 'Patient',
        dataIndex: ['patient'],
        showSorterTooltip: {
            target: 'full-header',
        },
        sorter: (a, b) => a.user.name.localeCompare(b.user.name),
        render: (patient) => {
            return (
                <div className='flex items-center'>
                    <img
                        src={process.env.NEXT_PUBLIC_BACKEND_URL + '/storage/' + (patient.profile != null ? patient.profile : 'images/placeholder.jpg')}
                        width={30}
                        height={30}
                        className='rounded-full ring-2 ring-white'
                    />

                    <span className='ml-2'>{patient.name}</span>
                </div>
            );
        },
    },
    {
        title: 'Date',
        dataIndex: 'date',
        sorter: (a, b) => compareDates(a.date, b.date),
    },
    {
        title: 'Appointment time',
        dataIndex: ['time_slot'],
        render: (name) => (
            <>
                <Tag color='blue' key={name.id}>
                    {name.start_time} - {name.end_time}
                </Tag>
            </>
        ),
    },
    {
        title: 'Service',
        dataIndex: ['service'],
        render: (name) => (
            <>
                {name.service}
            </>
        ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: (status) => {
            var color = 'red';
            if (status === 'booked') {
                color = 'blue';
            } else if (status === 'check-in') {
                color = 'green';
            } else if (status === 'check-out') {
                color = 'yellow';
            } else {
                color = 'red';
            }
            return (
                <Tag color={color} key={status}>
                    {status}
                </Tag>
            );
        },
    },

    {
        title: 'Action',
        key: 'action',
        render: (_, record) => {
            const router = useRouter();
            return (
                <Space size="middle">
                    <Button shape="circle" icon={<EditOutlined />}
                        onClick={() => router.push(`/staff/appointments/${record.id}`)}
                    />
                    <Button shape="circle" icon={<DeleteOutlined />} />
                </Space>
            );
        }
    },
];

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false)

    const getAppointments = async () => {
        setLoading(true)
        try {
            const response = await axios
                .get('/api/all-appointments')
                .then(res => {
                    setAppointments(res.data);
                    setLoading(false)
                    console.log(res.data);
                })
                .catch(error => {
                    setLoading(false)
                });
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getAppointments();
    }, [])

    return (
        <Staff>
            <div className='flex justify-between mb-5'>
                <h2 className='text-xl'>All Appointments</h2>
                <div>
                    <Link href='/staff/appointment-calendar-view'>
                        <Button type="dashed" icon={<CalendarOutlined />} >
                            Switch to Calendar view
                        </Button>
                    </Link>

                    <Link href='/staff/appointments/create' className='ml-3'>
                        <Button type="primary" icon={<PlusOutlined />} >
                            Add New Appointment
                        </Button>
                    </Link>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={appointments}
                showSorterTooltip={{
                    target: 'sorter-icon',
                }}
                bordered={true}
                size='middle'
                rowKey='id'
                loading={loading}
            />
        </Staff>
    )
}

export default Appointment
