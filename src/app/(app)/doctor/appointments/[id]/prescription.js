"use client";
import axios from "@/lib/axios";
import { FilePdfOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, message, Select, Spin, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";

const EditableCell = ({ editing, dataIndex, inputType, record, medicines, ...restProps }) => {
    let inputNode;

    switch (inputType) {
        case 'number':
            inputNode = <InputNumber />;
            break;
        case 'selectmedicine':
            inputNode = (
                <Select
                    showSearch
                    optionFilterProp="label"
                    placeholder="Select Medicine"
                    options={medicines.map(medicine => ({
                        value: medicine.id,
                        label: medicine.name,
                    }))}
                />
            );
            break;
        case 'selectduration':
            inputNode = (
                <Select
                    placeholder="Select Duration"
                    options={[
                        { value: 'one_day_only', label: '1 day only' },
                        { value: 'three_days', label: '3 days' },
                        { value: 'one_week', label: '1 week' },
                        { value: 'two_week', label: '2 weeks' },
                        { value: 'one_month', label: '1 month' },
                    ]}
                />
            );
            break;
        case 'selecttime':
            inputNode = (
                <Select
                    placeholder="Select Time"
                    options={[
                        { value: 'after_meal', label: 'After meal' },
                        { value: 'before_meal', label: 'Before meal' },
                    ]}
                />
            );
            break;
        case 'selectinterval':
            inputNode = (
                <Select
                    placeholder="Select Interval"
                    options={[
                        { value: 'every_morning', label: 'Every morning' },
                        { value: 'every_morning_evening', label: 'Every morning & evening' },
                        { value: 'three_times_day', label: 'Three times a day' },
                        { value: 'four_times_day', label: 'Four times a day' },
                    ]}
                />
            );
            break;
        default:
            inputNode = <Input />;
    }

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={[record.hierarchy, dataIndex]}
                    initialValue={record[dataIndex] || ''}
                    rules={[{ required: true, message: `Please input ${dataIndex}!` }]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                restProps.children
            )}
        </td>
    );
};

const Prescription = ({ id }) => {
    const [data, setData] = useState([]);

    const [medicines, setMedicines] = useState([]);
    const [form] = Form.useForm();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [saveLoading, setSaveLoading] = useState(false);
    const [generateAllow, setGenerateAllow] = useState(true);
    const [generateLoading, setGenerateLoading] = useState(false);

    const addNewRow = (index) => {
        const newKey = (parseInt(data[data.length - 1]?.hierarchy, 10) + 1).toString();
        const newRow = {
            hierarchy: newKey,
            medicine_id: null,
            dosage: null,
            duration: null,
            time: null,
            interval: null,
        };
        const newData = [...data];
        newData.splice(index + 1, 0, newRow);
        setData(newData);
    };

    const columns = [
        {
            title: 'SNo.',
            dataIndex: 'hierarchy',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Medicines',
            dataIndex: 'medicine_id',
            editable: true,
        },
        {
            title: 'Dosage',
            dataIndex: 'dosage',
            editable: true,
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            editable: true,
        },
        {
            title: 'Time',
            dataIndex: 'time',
            editable: true,
        },
        {
            title: 'Dose Interval',
            dataIndex: 'interval',
            editable: true,
        },
        {
            title: 'Operation',
            dataIndex: 'operation',
            render: (_, record, index) => (
                <Button
                    type="link"
                    onClick={() => addNewRow(index)}
                >
                    Add New
                </Button>
            ),
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: (record) => {
                let inputType = 'text';

                if (col.dataIndex === 'dosage') {
                    inputType = 'number';
                } else if (col.dataIndex === 'medicine_id') {
                    inputType = 'selectmedicine';
                } else if (col.dataIndex === 'duration') {
                    inputType = 'selectduration';
                } else if (col.dataIndex === 'time') {
                    inputType = 'selecttime';
                } else if (col.dataIndex === 'interval') {
                    inputType = 'selectinterval';
                }

                return {
                    record,
                    inputType,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: true,
                    medicines,
                };
            },
        };
    });

    const handleSave = async () => {
        const values = form.getFieldsValue();
        setSaveLoading(true);
        try {
            await axios.post('/api/prescription-create',
                { values }
                , { params: { id: id, editing: editing } }
            ).then(() => {
                messageApi.open({
                    type: 'success',
                    content: 'Prescription edited sucessfully',
                });
                setSaveLoading(false)
            });
        } catch (e) {
            console.log(e);
            messageApi.open({
                type: 'error',
                content: 'Something went wrong',
            });
            setSaveLoading(false)
        }

    };

    const getPrescriptions = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/prescription', { params: { id: id } });
            if (response.data && response.data.medicines.length > 0) {
                setData(response.data.medicines);
                form.setFieldsValue({ problem: response.data.problem_description });
                form.setFieldsValue({ test: response.data.test });
                form.setFieldsValue({ advice: response.data.advice });

                setEditing(true);
                setLoading(false);
                setGenerateAllow(false);
            } else {
                setData([
                    {
                        hierarchy: '0',
                        medicine_id: null,
                        dosage: null,
                        duration: null,
                        time: null,
                        interval: null,
                    }
                ])
                setLoading(false);
            }
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    }

    const getMedicines = async () => {
        try {
            const response = await axios.get('/api/all-medicines');
            setMedicines(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

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
        getMedicines();
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
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
            >
                {contextHolder}
                <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                    {/* Problem section */}
                    <div className="sm:col-span-3">
                        <label className="inline-block text-gray-800 mt-2.5">
                            Problem Description
                        </label>
                    </div>

                    <div className="sm:col-span-9">
                        <Form.Item name="problem">
                            <TextArea
                                autoSize
                                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                placeholder="Enter problem description"
                            />
                        </Form.Item>
                    </div>
                    {/* End of Problem section */}

                    {/* Test Section */}
                    <div className="sm:col-span-3">
                        <label className="inline-block text-gray-800 mt-2.5">
                            Test
                        </label>
                    </div>

                    <div className="sm:col-span-9">
                        <Form.Item name="test">
                            <TextArea
                                autoSize
                                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                placeholder="Enter the Test"
                            />
                        </Form.Item>
                    </div>

                    {/* Advice section */}
                    <div className="sm:col-span-3">
                        <label className="inline-block text-gray-800 mt-2.5">
                            Advice
                        </label>
                    </div>

                    <div className="sm:col-span-9">
                        <Form.Item name="advice">
                            <TextArea
                                autoSize
                                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                placeholder="Enter the advice"
                            />
                        </Form.Item>
                    </div>
                    {/* End of advice section */}

                    {/* Medicine Section */}
                    <div className="sm:col-span-12">
                        <Table
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            bordered
                            dataSource={data.map((item, index) => ({ ...item, key: item.hierarchy || index }))}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            pagination={false}
                            size="small"
                        />
                    </div>
                    {/* End of medicine section */}
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-x-2">
                    <Button
                    >
                        Cancel
                    </Button>

                    <Button type="primary" htmlType="submit" loading={saveLoading}>
                        Save
                    </Button>
                </div>
                {/* End of actions */}
            </Form>
        </>
    );
};

export default Prescription;
