"use client";

import React, { FC, useState } from "react";
import ThemeSwitcher from "@/app/utils/ThemeSwitcher";
import { IoMdNotificationsOutline } from "react-icons/io";

type Props = {};

const DashboardHeader: FC<Props> = (props) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0">
            <ThemeSwitcher />
            <div className="relative cursor-pointer m-2" onClick={() => setOpen(!open)}>
                <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
                <span className="absolute -top-2 -right-2 bg-teal-500 rounded-full w-5 h-5 text-sm flex items-center justify-center text-white">
                    3
                </span>
            </div>
            {open && (
                <div className="w-96 h-[50vh] dark:bg-[#111C43] bg-white shadow-xl absolute top-16 z-10 rounded">
                    <h5 className="text-center text-xl font-Poppins text-black dark:text-white p-3">
                        Notifications
                    </h5>
                    <div className="dark:bg-gray-700 bg-gray-200 font-Poppins border-b dark:border-b-gray-500 border-b-black">
                        <div className="w-full flex items-center justify-between p-2">
                            <p className="text-black dark:text-white">New Question Received</p>
                            <p className="text-black dark:text-white cursor-pointer">
                                Mark as read
                            </p>
                        </div>
                        <p className="px-2 text-black dark:text-white">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus
                            nulla placeat quasi? Nostrum, quas aperiam.
                        </p>
                        <p className="p-2 text-black dark:text-white text-sm">5 days ago</p>
                    </div>
                    <div className="dark:bg-gray-700 bg-gray-200 font-Poppins border-b dark:border-b-gray-500 border-b-black">
                        <div className="w-full flex items-center justify-between p-2">
                            <p className="text-black dark:text-white">New Question Received</p>
                            <p className="text-black dark:text-white cursor-pointer">
                                Mark as read
                            </p>
                        </div>
                        <p className="px-2 text-black dark:text-white">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus
                            nulla placeat quasi? Nostrum, quas aperiam.
                        </p>
                        <p className="p-2 text-black dark:text-white text-sm">5 days ago</p>
                    </div>
                    <div className="dark:bg-gray-700 bg-gray-200 font-Poppins border-b dark:border-b-gray-500 border-b-black">
                        <div className="w-full flex items-center justify-between p-2">
                            <p className="text-black dark:text-white">New Question Received</p>
                            <p className="text-black dark:text-white cursor-pointer">
                                Mark as read
                            </p>
                        </div>
                        <p className="px-2 text-black dark:text-white">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus
                            nulla placeat quasi? Nostrum, quas aperiam.
                        </p>
                        <p className="p-2 text-black dark:text-white text-sm">5 days ago</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHeader;
