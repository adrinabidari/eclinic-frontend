"use client";
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { Button, message, Spin, Tabs } from 'antd';
import Link from 'next/link';
import { ArrowLeftOutlined, FilePdfOutlined } from '@ant-design/icons';
import Overview from './overview';
import Admin from '../../page';

const AppointmentDetails = ({ params }) => {
    const id = params.id;
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generateLoading, setGenerateLoading] = useState(false);

    const generatePdf = async () => {
        setGenerateLoading(true);
        try {
            const response = await axios.get(`/api/generate-appointment-pdf/${id}`, {
                responseType: 'blob',
                headers: {
                    'Accept': 'application/pdf',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            setGenerateLoading(false);

            // Create a URL for the Blob object
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Open the PDF in a new tab
            window.open(url, '_blank');
        } catch (error) {
            console.error("Error generating PDF:", error);
            setGenerateLoading(false);
        }

    }

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
                <p>No appointment found.</p>
            </Admin>
        );
    }


    const items = [
        {
            key: '1',
            label: 'Overview',
            children: <Overview appointment={appointment} id={id} />,
        },
    ];

    return (

        <Admin>
            <div className="bg-white rounded-xl shadow p-4 sm:p-7">
                <div className="mb-8 flex justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Appointment Details
                        </h2>
                    </div>
                    <div>
                        <Button type="dashed" icon={<FilePdfOutlined />} onClick={generatePdf} loading={generateLoading}>
                            Generate Invoice
                        </Button>
                        <Link href='/admin/appointments/' className='ml-3'>
                            <Button type="primary" icon={<ArrowLeftOutlined />} >
                                Back
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultActiveKey="1"
                    items={items}
                    type="card"
                />

            </div>
        </Admin >
    );
}

export default AppointmentDetails;
