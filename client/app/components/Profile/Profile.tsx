"use client";

import React, { FC, useState } from "react";
import SidebarProfile from "./SidebarProfile";
import { useLogOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";

type Props = {
    user: any;
};

const Profile: FC<Props> = ({ user }) => {
    const [scroll, setScroll] = useState(false);
    const [active, setActive] = useState(1);
    const [avatar, setAvatar] = useState(user?.avatar.url || null);
    const [logout, setLogout] = useState(false);

    const {} = useLogOutQuery(undefined, {
        skip: !logout ? true : false, // we will skip the query if the logout state is false
    });

    const logoutHandler = async () => {
        setLogout(true);
        await signOut();
        redirect("/");
    };

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        });
    }

    return (
        <div className="w-[85%] flex mx-auto">
            <div
                className={`w-14 800px:w-80 h-[450px] dark:bg-slate-900 bg-white bg-opacity-90 border dark:border-[#ffffff1d] border-neutral-200 rounded-md dark:shadow-sm shadow-md mt-20 mb-20 sticky ${
                    scroll ? "top-[120px]" : "top-[30px]"
                }`}
            >
                <SidebarProfile
                    user={user}
                    active={active}
                    avatar={avatar}
                    setActive={setActive}
                    logoutHandler={logoutHandler}
                />
            </div>
            {active === 1 && (
                <div className="w-full h-full bg-transparent mt-20">
                    <ProfileInfo />
                </div>
            )}
            {active === 2 && (
                <div className="w-full h-full bg-transparent mt-20">
                    <ChangePassword />
                </div>
            )}
        </div>
    );
};

export default Profile;
