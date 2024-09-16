"use client"

import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
import { Table, Button, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Doctor from '../page';

const columns = [
    {
        title: 'S.No.',
        dataIndex: 'id',
        showSorterTooltip: {
            target: 'full-header',
        },
    },
    {
        title: 'Date',
        dataIndex: 'date',
    },
    {
        title: 'Reason',
        dataIndex: 'reason',
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Button onClick={() => console.log('hi' + record.id)} shape="circle" icon={<EyeOutlined />} />
                <Button shape="circle" icon={<EditOutlined />} />
                <Button shape="circle" icon={<DeleteOutlined />} />
            </Space>
        ),
    },
];

const Holidays = () => {
    const [holidays, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false)

    const getHolidays = async () => {
        setLoading(true)
        try {
            const response = await axios
                .get('/api/holidays')
                .then(res => {
                    setDoctors(res.data);
                    setLoading(false)
                }
                )
                .catch(error => {
                    setLoading(false)
                });
        } catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        getHolidays();
    }, [])

    return (
        <Doctor>
            <div className='flex justify-between mb-5'>
                <h2 className='text-xl'>All Holidays</h2>
                <Link href='/doctor/holidays/create'>
                    <Button type="primary" icon={<PlusOutlined />} >
                        Add New Holiday
                    </Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={holidays}
                showSorterTooltip={{
                    target: 'sorter-icon',
                }}
                bordered={true}
                size='small'
                rowKey='id'
                loading={loading}
            />
        </Doctor>
    )
}

export default Holidays