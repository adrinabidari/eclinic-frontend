"use client"
import { Card, Tabs } from "antd"
import Doctor from "../page"
import Sunday from "./Sunday";
import Monday from "./Monday";
import Tuesday from "./Tuesday";
import Wednesday from "./Wednesday";
import Thursday from "./Thursday";
import Friday from "./Friday";
import Saturday from "./Saturday";

const DoctorScheduleEdit = () => {
    const items = [
        {
            key: '1',
            label: '1. Sunday',
            children: <Sunday />,
        },
        {
            key: '2',
            label: '2. Monday',
            children: <Monday />,
        },
        {
            key: '3',
            label: '3. Tuesday',
            children: <Tuesday />,
        },
        {
            key: '4',
            label: '4. Wednesday',
            children: <Wednesday />,
        },
        {
            key: '5',
            label: '5. Thursday',
            children: <Thursday />,
        },
        {
            key: '6',
            label: '6. Friday',
            children: <Friday />,
        },
        {
            key: '7',
            label: '7. Saturday',
            children: <Saturday />,
        },
    ];
    return (
        <Doctor>
            <Card title="My schedule">
                <Tabs defaultActiveKey="1"
                    items={items}
                    type="card"
                />
            </Card>
        </Doctor>
    )
}

export default DoctorScheduleEdit