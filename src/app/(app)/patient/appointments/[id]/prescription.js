"use client";
import axios from "@/lib/axios";
import { FilePdfOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, message, Select, Spin } from "antd";
import { useEffect, useState } from "react";

const Prescription = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [generateAllow, setGenerateAllow] = useState(true);
    const [generateLoading, setGenerateLoading] = useState(false);

    const getPrescriptions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/prescription', { params: { id: id } });
            if (response.data && response.data.medicines.length > 0) {
                setLoading(false);
                setGenerateAllow(false);
            } else {
                setLoading(false);
            }
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    }

    const generatePdf = async () => {
        setGenerateLoading(true);
        try {
            const response = await axios.get(`/api/generate-prescription-pdf/${id}`, {
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
        getPrescriptions();
    }, []);


    if (loading) {
        return (<Spin />);
    }

    return (
        <>

            <Button type="dashed" icon={<FilePdfOutlined />}
                onClick={generatePdf}
                loading={generateLoading}
                disabled={generateAllow}
            >
                Generate Prescription
            </Button>
        </>
    );
};

export default Prescription;
