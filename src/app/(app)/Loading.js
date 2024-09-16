import { Spin } from "antd"

const Loading = () => {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
            <Spin />
            Loading...
        </div>
    )
}

export default Loading
