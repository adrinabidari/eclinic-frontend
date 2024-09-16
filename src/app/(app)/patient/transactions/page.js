"use client"
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Table, Button, Space, Tag } from "antd";
import { EyeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Patient from '../page';

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
        title: 'Doctor',
        dataIndex: ['doctor'],
        showSorterTooltip: {
            target: 'full-header',
        },
        sorter: (a, b) => a.doctor.name.localeCompare(b.doctor.name),
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
        title: 'E-mail',
        dataIndex: ['doctor', 'email'],
    },
    {
        title: 'Date',
        dataIndex: 'created_at',
        sorter: (a, b) => compareDates(a.created_at, b.created_at),
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
        sorter: (a, b) => compareAmounts(a, b),
        render: (amount) => <span>Rs. {amount.toFixed(2)}</span> // Format amount for display
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => {
            const router = useRouter();
            return (
                <Space size="middle">
                    <Button shape="circle" icon={<EyeOutlined />}
                        onClick={() => router.push(`/patient/transactions/${record.id}`)}
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
        <Patient>
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
        </Patient>
    )
}

export default Transaction
