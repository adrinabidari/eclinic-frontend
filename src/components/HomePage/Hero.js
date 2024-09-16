"use client"
import { useState, useEffect } from 'react';
import { South } from "@mui/icons-material"

const Hero = () => {
    const [navWidth, setNavWidth] = useState(1200);

    useEffect(() => {
        const updateNavWidth = () => {
            const navElement = document.getElementById("nav");
            if (navElement) {
                setNavWidth(navElement.offsetWidth);
            }
        };

        // Initial update
        updateNavWidth();

        // Update on resize
        window.addEventListener('resize', updateNavWidth);

        return () => {
            window.removeEventListener('resize', updateNavWidth);
        };
    }, []);

    return (
        <>
            <div className="hero md:h-[110vh] h-[90vh] mx-auto md:p-8 p-4 relative overflow-hidden md:-mt-20 mx-auto">
                <div className="md:absolute md:top-[250px] md:mx-[20px]">
                    <p className="text-sm">Custom Doctor Appointment Booking Software</p>
                    <p className="md:text-4xl text-3xl font-semibold md:mt-8 mt-4">
                        A white label patient<br /> appointment bookings system.
                    </p>
                    <p className="text-sm md:mt-14 mt-8">
                        Book your clinic appointment with ease with<br /><span className="font-bold text-[#011473]"> #eClinicNexus</span>
                    </p>
                    <div className="flex align-middle mt-[50px] w-min border border-slate-800 rounded-full p-2.5">
                        <South />
                        <p className="cursor-pointer font-black ml-2 min-w-28 font-black text-sm">Scroll for more</p>
                    </div>
                    {/* <div style={{ backgroundColor: '#D9D9D9', height: '2.5rem', minWidth: `${navWidth}px`, marginTop: '40px' }}>
                    </div> */}
                </div>
                <img
                    className="hidden md:block md:absolute w-[1055px] top-[-57px] right-[-264px] object-cover -z-10 opacity-75"
                    alt=""
                    src="/heroimg.png"
                />
            </div>
        </>
    )
}

export default Hero
