import axios from "@/lib/axios";
import { message, Select, Tag } from "antd";

const Overview = ({ appointment, id }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const handleChangeForStatus = async (value) => {
        const response = await axios.put(`/api/appointment-status-edit/${id}`, { status: value })
            .then((res) => {
                messageApi.open({
                    type: 'success',
                    content: 'Changed Status',
                });
            })
            .catch((e) => {
                messageApi.open({
                    type: 'error',
                    content: 'Error changing status',
                });
            })
    }


    const handleChangeForPayment = async (value) => {
        const response = await axios.put(`/api/appointment-payment-edit/${id}`, { payment: value })
            .then((res) => {
                messageApi.open({
                    type: 'success',
                    content: 'Changed Status',
                });
            })
            .catch((e) => {
                messageApi.open({
                    type: 'error',
                    content: 'Error changing status',
                });
            })
    }

    return (

        <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
            {contextHolder}
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
                    <Select
                        defaultValue={appointment.status}
                        placeholder="Select status"
                        onChange={handleChangeForStatus}
                        disabled
                        options={[
                            {
                                value: 'booked',
                                label: 'Booked',
                            },
                            {
                                value: 'check-in',
                                label: 'Check in',
                            },
                            {
                                value: 'check-out',
                                label: 'Check Out',
                            },
                            {
                                value: 'cancelled',
                                label: 'Cancelled',
                            },
                        ]}
                    />
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
                    <Select
                        defaultValue={appointment.payment}
                        placeholder="Select a payment"
                        onChange={handleChangeForPayment}
                        disabled
                        options={[
                            {
                                value: 0,
                                label: 'Pending',
                            },
                            {
                                value: 1,
                                label: 'Paid',
                            },
                        ]}
                    />
                </div>
            </div>
            {/* end of 4th row */}
        </div>
    );
}

export default Overview;