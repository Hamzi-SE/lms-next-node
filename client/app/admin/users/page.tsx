"use client";

import AdminSidebar from "@/app/components/Admin/AdminSidebar";
import AllUsers from "@/app/components/Admin/User/AllUsers";
import DashboardHero from "@/app/components/Admin/DashboardHero";
import Heading from "@/app/utils/Heading";
import AdminProtected from "@/hooks/adminProtected";
import React from "react";

type Props = {};

const page = (props: Props) => {
    return (
        <AdminProtected>
            <Heading
                title="LMS - Admin"
                description="Admin page for LMS"
                keywords="admin, lms, learning, management, system"
            />
            <div className="flex h-screen">
                <div className="1500px:w-1/6 w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-5/6">
                    <DashboardHero />
                    <AllUsers />
                </div>
            </div>
        </AdminProtected>
    );
};

export default page;
