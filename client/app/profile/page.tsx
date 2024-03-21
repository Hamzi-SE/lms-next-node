"use client";

import Protected from "@/hooks/useProtected";
import React, { FC, useState } from "react";
import Heading from "../utils/Heading";
import Header from "../components/Header";
import Profile from "@/app/components/Profile/Profile";
import { useAppSelector } from "@/redux/store";

type Props = {};

const page: FC<Props> = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(5);
    const [route, setRoute] = useState("Login");
    const { user } = useAppSelector((state) => state.auth);

    return (
        <div>
            <Protected>
                <Heading
                    title={`${user.name}'s Profile | LMS`}
                    description="User profile"
                    keywords="Profile, LMS"
                />
                <Header
                    open={open}
                    setOpen={setOpen}
                    activeItem={activeItem}
                    route={route}
                    setRoute={setRoute}
                />
                <Profile user={user} />
            </Protected>
        </div>
    );
};

export default page;
