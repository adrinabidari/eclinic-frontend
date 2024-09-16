"use client"

import { useAuth } from "@/hooks/auth"
import { useEffect, useState } from 'react'
import { Card, Statistic } from 'antd'
import dynamic from "next/dynamic";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import CountUp from 'react-countup'
import axios from '@/lib/axios'
import Patient from '../page'

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const formatter = (value) => <CountUp end={value} separator="," duration={3} />;

const Dashboard = () => {
    const { user } = useAuth({ middleware: 'auth' });
    const [data, setData] = useState({
        totalAppointments: 0,
        todayAppointments: 0,
        nextAppointments: 0,
        monthlyExpense: 0,
        previousMonthExpense: 0,
        monthlyAppointments: []
    });

    const getDashboardDetail = async () => {
        await axios.get(`/api/patient-dashboard`, {
            params: {
                doctor_id: user.id
            }
        })
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    };

    const calculatePercentageChange = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const percentageChange = calculatePercentageChange(data.monthlyExpense, data.previousMonthExpense);
    const isGain = percentageChange >= 0;

    useEffect(() => {
        getDashboardDetail();
    }, []);

    const option = {
        chart: {
            id: 'apexchart-example'
        },
        xaxis: {
            categories: data.monthlyAppointments.map(item => item.month_name),  // Display month names on the x-axis
        },
        dataLabels: {
            enabled: false
        },
    };

    const series = [{
        name: 'Appointments',
        data: data.monthlyAppointments.map(item => item.count)
    }];

    return (
        <Patient>
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                <div className="sm:col-span-4">
                    <Card>
                        <Statistic title="Total Appointments" value={data.totalAppointments} formatter={formatter} />
                    </Card>
                </div>
                <div className="sm:col-span-4">
                    <Card>
                        <Statistic title="Today Appointments" value={data.todayAppointments} formatter={formatter} />
                    </Card>
                </div>
                <div className="sm:col-span-4">
                    <Card>
                        <Statistic title="Next Appointments" value={data.nextAppointments} formatter={formatter} />
                    </Card>
                </div>
            </div>
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-6 mt-4">
                <div className="sm:col-span-9">
                    <Card title="Monthly Appointments">
                        <ApexChart type="area" options={option} series={series} />
                    </Card>
                </div>
                <div className="sm:col-span-3">
                    <Card>
                        <Statistic
                            title="Monthly Expenses"
                            value={data.monthlyExpense.toFixed(2)}
                            precision={2}
                            valueStyle={{
                                color: isGain ? '#3f8600' : '#cf1322',
                            }}
                            prefix={isGain ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            suffix={` (${percentageChange.toFixed(2)}%)`}  // Format the percentage change with parentheses
                        />
                    </Card>
                </div>
            </div>
        </Patient>
    );
}

export default Dashboard