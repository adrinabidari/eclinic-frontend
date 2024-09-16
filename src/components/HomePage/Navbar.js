"use client";
import { Close, Menu } from "@mui/icons-material";
import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav
            className={`border-gray-200 z-20 sticky top-0 transition-colors duration-300 font-black ${scrolled ? "bg-white border border-gray-200" : "bg-transparent"}`}
        >
            <div
                className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
                id="nav"
            >
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-black whitespace-nowrap">
                        eClinicNexus.
                    </span>
                </Link>
                <button
                    data-collapse-toggle="navbar-default"
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    aria-controls="navbar-default"
                    aria-expanded={menuOpen ? "true" : "false"}
                    onClick={toggleMenu}
                >
                    <span className="sr-only">Open main menu</span>
                    {menuOpen ? <Close /> : <Menu />}
                </button>
                <div
                    className={`${menuOpen ? "block" : "hidden"
                        } w-full md:block md:w-auto font-semibold`}
                    id="navbar-default"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0">
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                            >
                                Our Teams
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0"
                            >
                                About Us
                            </a>
                        </li>
                    </ul>
                </div>
                <div
                    className={`${menuOpen ? "block" : "hidden"
                        } w-full lg:block lg:w-auto font-semibold`}
                    id="navbar-default"
                >
                    <ul className="flex p-4 md:p-0 mt-4 lg:flex-row md:space-x-4 md:mt-0 align-center">
                        <li>
                            <Link
                                href="/login"
                                className="block py-2 px-5 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 border border-black rounded-full"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-5 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 border border-black rounded-full bg-[#011473] text-white text-xs lg:text-base"
                            >
                                Book An Appointment
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
