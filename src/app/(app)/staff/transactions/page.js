"use client"
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Table, Button, Space, Tag, Card } from "antd";
import { CalendarOutlined, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Doctor from '../page';

// Helper function to compare dates
const compareDates = (a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
};

// Helper function to compare amounts
const compareAmounts = (a, b) => {
    return a.total_amount - b.total_amount;
};


const columns = [
    {
        title: 'Patient',
        dataIndex: ['patient'],
        showSorterTooltip: {
            target: 'full-header',
        },
        sorter: (a, b) => a.patient.name.localeCompare(b.patient.name),
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
        title: 'E-mail',
        dataIndex: ['patient', 'email'],
    },
    {
        title: 'Date',
        dataIndex: 'created_at',
        sorter: (a, b) => compareDates(a.created_at, b.created_at), // Ensure sorting works with the correct date field
        render: (date) => <span>{new Date(date).toLocaleDateString()}</span> // Format date for display
    },
    {
        title: 'Payment Method',
        dataIndex: 'payment_method',
        render: (payment) => {
            var pay = '';
            switch (payment) {
                case 'digital_wallet':
                    pay = 'Digital Wallet';
                    break;
                case 'manually':
                    pay = 'Manually';
                    break;
                case 'bank':
                    pay = 'Bank';
                    break;
                default:
                    pay = 'Unknown';
                    break;
            }

            return (
                <>
                    {pay}
                </>)
        }
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
        title: 'Amount',
        dataIndex: 'total_amount',
        sorter: (a, b) => compareAmounts(a, b), // Ensure sorting works with the correct amount field
        render: (amount) => <span>Rs. {amount.toFixed(2)}</span> // Format amount for display
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => {
            const router = useRouter(); // Ensure router is available here
            return (
                <Space size="middle">
                    {/* <Button onClick={() => console.log('hi' + record.id)} shape="circle" icon={<EyeOutlined />} /> */}
                    <Button shape="circle" icon={<EyeOutlined />}
                        onClick={() => router.push(`/staff/transactions/${record.id}`)}
                    />
                </Space>
            );
        }
    },
];

const Transaction = () => {
    const [transactions, setAppointments] = useState([]);
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
        <Doctor>
            <Table
                columns={columns}
                dataSource={transactions}
                showSorterTooltip={{
                    target: 'sorter-icon',
                }}
                bordered={true}
                size='middle'
                rowKey='id'
                loading={loading}
            />
        </Doctor>
    )
}

export default Transaction
