"use client";

import Login from "@/app/components/Auth/Login";
import SignUp from "@/app/components/Auth/SignUp";
import Verification from "@/app/components/Auth/Verification";
import CustomModal from "@/app/utils/CustomModal";
import NavItems from "@/app/utils/NavItems";
import ThemeSwitcher from "@/app/utils/ThemeSwitcher";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import defaultAvatar from "@/public/assets/avatar.png";
import { useSession } from "next-auth/react";
import { useLogOutQuery, useSocialAuthMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/store";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
    route: string;
    setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, open, route, setRoute }) => {
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    // const [logout, setLogout] = useState(false);

    // const {} = useLogOutQuery(undefined, {
    //     skip: !logout ? true : false, // we will skip the query if the logout state is false
    // });

    const { user } = useAppSelector((state) => state.auth);
    const { data } = useSession();
    const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();

    useEffect(() => {
        if (!user) {
            if (data) {
                socialAuth({
                    email: data?.user?.email,
                    name: data?.user?.name,
                    avatar: data?.user?.image,
                });
            }
        }

        if (data === null) {
            if (isSuccess) {
                toast.success("Logged in successfully");
            }
        }

        if (error) {
            toast.error("An error occurred");
        }

        // if (status === "authenticated" && data === null) {
        //     setLogout(true);
        // }
    }, [data, user]);

    if (typeof window !== "undefined") {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 80) {
                setActive(true);
            } else {
                setActive(false);
            }
        });
    }

    const handleCloseSidebar = (e: any) => {
        if (e.target.id === "screen") {
            setOpenSidebar(false);
        }
    };

    return (
        <div className="w-full relative">
            <div
                className={`${
                    active
                        ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
                        : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
                }`}
            >
                <div className="w-[95%] 800px:w-[92%] m-auto py-2 h-full">
                    <div className="w-full h-[80px] flex items-center justify-between p-3">
                        <div>
                            <Link
                                href="/"
                                className="text-[25px] font-Poppins font-[500] text-black dark:text-white"
                            >
                                LMS
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <NavItems activeItem={activeItem} isMobile={false} />
                            <ThemeSwitcher />
                            {/* Only for mobile */}
                            <div className="800px:hidden">
                                <HiOutlineMenuAlt3
                                    size={25}
                                    className="cursor-pointer text-black dark:text-white"
                                    onClick={() => setOpenSidebar(true)}
                                />
                            </div>
                            {user ? (
                                <Link href={"/profile"}>
                                    <Image
                                        src={user?.avatar?.url || defaultAvatar}
                                        width={30}
                                        height={30}
                                        alt="avatar"
                                        className={`rounded-full cursor-pointer ${
                                            activeItem === 5 ? "border-2 border-teal-500" : ""
                                        }`}
                                    />
                                </Link>
                            ) : (
                                <HiOutlineUserCircle
                                    size={25}
                                    className="hidden 800px:block cursor-pointer text-black dark:text-white"
                                    onClick={() => setOpen(true)}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile sidebar */}
                {openSidebar && (
                    <div
                        className="fixed w-full h-screen top-0 left-0 z-[999] dark:bg-[unset] bg-[#00000024]"
                        onClick={handleCloseSidebar}
                        id="screen"
                    >
                        <div className="w-[70%] fixed z-[9999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
                            <NavItems activeItem={activeItem} isMobile={true} />
                            <HiOutlineUserCircle
                                size={25}
                                className="cursor-pointer ml-5 my-2 text-black dark:text-white"
                                onClick={() => setOpen(true)}
                            />
                            <br /> <br />
                            <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                                Copyright &copy; 2024 LMS
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {route === "Login" && (
                <>
                    {open && (
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            activeItem={activeItem}
                            component={Login}
                        />
                    )}
                </>
            )}
            {route === "Sign-Up" && (
                <>
                    {open && (
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            activeItem={activeItem}
                            component={SignUp}
                        />
                    )}
                </>
            )}
            {route === "Verification" && (
                <>
                    {open && (
                        <CustomModal
                            open={open}
                            setOpen={setOpen}
                            setRoute={setRoute}
                            activeItem={activeItem}
                            component={Verification}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Header;
