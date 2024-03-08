"use client";

import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "@/app/components/Header";
import Hero from "@/app/components/Route/Hero";

interface Props {}

const Page: FC<Props> = (props) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("Login");

    return (
        <div>
            <Heading
                title="LMS"
                description="LMS is a learning management system"
                keywords="MERN, LMS, Learning, Management, System"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                route={route}
                setRoute={setRoute}
            />
            <Hero />
        </div>
    );
};

export default Page;
