"use client";

import React from "react";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminProtected from "@/hooks/adminProtected";
import DashboardHero from "../components/Admin/DashboardHero";

type Props = {};

const page = (props: Props) => {
    return (
        <AdminProtected>
            <Heading
                title="LMS - Admin"
                description="Admin page for LMS"
                keywords="admin, lms, learning, management, system"
            />
            <div className="flex h-[200vh]">
                <div className="1500px:w-1/6 w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-5/6">
                    <DashboardHero />
                </div>
            </div>
        </AdminProtected>
    );
};

export default page;
