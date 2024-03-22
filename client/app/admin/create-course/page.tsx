"use client";

import React from "react";
import AdminSidebar from "@/app/components/Admin/AdminSidebar";
import Heading from "@/app/utils/Heading";
import CreateCourse from "@/app/components/Admin/Course/CreateCourse";
import DashboardHeader from "@/app/components/Admin/DashboardHeader";

type Props = {};

const page = (props: Props) => {
    return (
        <div>
            <Heading
                title="Create Course"
                description="Create a new course"
                keywords="create, course, new, course"
            />
            <div className="flex">
                <div className="1500px:w-1/6 w-1/5">
                    <AdminSidebar />
                </div>
                <div className="w-5/6">
                    <DashboardHeader />
                    <CreateCourse />
                </div>
            </div>
        </div>
    );
};

export default page;
