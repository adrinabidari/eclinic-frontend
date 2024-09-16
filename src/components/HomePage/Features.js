import { NorthEast } from "@mui/icons-material"

const Features = () => {
    return (<>
        <div className="max-w-screen-xl mx-auto mt-6 p-4">
            <div className="flex justify-between items-center">
                <h1 className="md:text-3xl text-sm font-bold mb-4">The Working Process Behind<br /> Our Services</h1>
                <p className="md:font-semibold text-xs">Your Health, Our Expertise</p>
            </div>

            <div className="grid md:grid-cols-3 grid-row-3 gap-4 mt-6">
                {/* card 1 */}
                <div className="bg-[#F5F5F5] rounded-[40px] p-8">
                    <div className="flex justify-between">
                        <span className="border border-black h-min py-1 px-2 rounded-full text-xs font-black">Working Process</span>
                        <NorthEast sx={{ fontSize: '60px' }} />
                    </div>
                    <h2 className="text-2xl font-bold">Registration</h2>
                    <p className="mt-4 mb-8 ">Patient can do registration from here with basic information.</p>
                    <span className="font-black text-7xl">01</span>
                </div>


                {/* card 2 */}
                <div className="bg-[#F5F5F5] rounded-[40px] p-8">
                    <div className="flex justify-between">
                        <span className="border border-black h-min py-1 px-2 rounded-full text-xs font-black">Working Process</span>
                        <NorthEast sx={{ fontSize: '60px' }} />
                    </div>
                    <h2 className="text-2xl font-bold">Make Appointment</h2>
                    <p className="mt-4 mb-8 ">Patient can book an appointment with doctor from landing page or from his login panel.</p>
                    <span className="font-black text-7xl">02</span>
                </div>

                {/* card 3 */}
                <div className="bg-[#F5F5F5] rounded-[40px] p-8">
                    <div className="flex justify-between">
                        <span className="border border-black h-min py-1 px-2 rounded-full text-xs font-black">Working Process</span>
                        <NorthEast sx={{ fontSize: '60px' }} />
                    </div>
                    <h2 className="text-2xl font-bold">Take Treatment</h2>
                    <p className="mt-4 mb-8 ">Doctors can interact with patients and do related treatment.</p>
                    <span className="font-black text-7xl">03</span>
                </div>
            </div>

        </div>
    </>)
}

export default Features