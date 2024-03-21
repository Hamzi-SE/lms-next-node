import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import avatarIcon from "@/public/assets/avatar.png";
import { styles } from "@/app/styles/style";
import { useUpdateAvatarMutation } from "@/redux/features/user/userApi";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import { useAppSelector } from "@/redux/store";
import toast from "react-hot-toast";

const ProfileInfo: FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const [name, setName] = useState<string>(user && user.name);
    const [loadUser, setLoadUser] = useState(false);
    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
    const {} = useLoadUserQuery(undefined, { skip: !loadUser });

    const imageHandler = async (e: any) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(e.target.files[0]);

        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                updateAvatar(fileReader.result);
            }
        };
    };
    useEffect(() => {
        if (isSuccess) {
            setLoadUser(true);

            toast.success("Avatar updated successfully");
        }

        if (error) {
            console.log(error);
        }
    }, [isSuccess, error]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("submit");
    };

    return (
        <>
            <div className="w-full flex justify-center">
                <div className="relative">
                    <Image
                        src={user?.avatar.url || avatarIcon}
                        alt="avatar"
                        className="w-32 h-32 cursor-pointer border-2 border-teal-500 rounded-full"
                        width={128}
                        height={128}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        name="avatar"
                        id="avatar"
                        className="hidden"
                        onChange={imageHandler}
                    />
                    <label htmlFor="avatar">
                        <div className="w-8 h-8 bg-slate-900 rounded-full absolute bottom-2 right-2 flex items-center justify-center cursor-pointer">
                            <AiOutlineCamera size={20} className="z-10" />
                        </div>
                    </label>
                </div>
            </div>
            <br />
            <br />
            <div className="w-full pl-6 800px:pl-10">
                <form onSubmit={handleSubmit}>
                    <div className="800px:w-1/2 m-auto block pb-4">
                        <div className="w-full">
                            <label htmlFor="name" className="block pb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className={`${styles.input} !w-11/12 mb-4 800px:mb-0`}
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="w-full pt-2">
                            <label htmlFor="name" className="block pb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                readOnly
                                className={`${styles.input} !w-11/12 mb-1 800px:mb-0`}
                                required
                                value={user?.email}
                            />
                        </div>
                        <input
                            type="submit"
                            required
                            value="Update"
                            className={`w-full 800px:w-64 h-10 border border-teal-500 text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer`}
                        />
                    </div>
                </form>
                <br />
            </div>
        </>
    );
};

export default ProfileInfo;
