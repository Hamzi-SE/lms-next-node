import { styles } from "@/app/styles/style";
import { useUpdatePasswordMutation } from "@/redux/features/user/userApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {};

const ChangePassword: React.FC<Props> = () => {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const [updatePassword, { isSuccess, error, isLoading }] = useUpdatePasswordMutation();

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Your new passwords do not match");
            return;
        }

        if (oldPassword === newPassword) {
            toast.error("Your new password cannot be the same as your old password");
            return;
        }

        await updatePassword({ oldPassword, newPassword });
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Password updated successfully");

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }

        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message || "An error occurred");
            }
        }
    }, [isSuccess, error]);

    return (
        <div className="w-full pl-7 px-2 800px:px-5 800px:pl-0">
            <h1 className="block text-2xl 800px:text-3xl font-Poppins text-center font-medium text-black dark:text-white pb-2">
                Change Password
            </h1>
            <div className="w-full">
                <form
                    aria-required
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center"
                >
                    <div className="w-full 800px:w-3/5 mt-5">
                        <label
                            htmlFor="oldPassword"
                            className="block pb-2 text-black dark:text-white"
                        >
                            Enter your old password
                        </label>
                        <input
                            type="password"
                            id="oldPassword"
                            className={`${styles.input} !w-11/12 mb-4 800px:mb-0 text-black dark:text-white`}
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="w-full 800px:w-3/5 mt-5">
                        <label
                            htmlFor="newPassword"
                            className="block pb-2 text-black dark:text-white"
                        >
                            Enter your new password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            className={`${styles.input} !w-11/12 mb-4 800px:mb-0 text-black dark:text-white`}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="w-full 800px:w-3/5 mt-5">
                        <label
                            htmlFor="confirmPassword"
                            className="block pb-2 text-black dark:text-white"
                        >
                            Confirm your new password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className={`${styles.input} !w-11/12 mb-4 800px:mb-0 text-black dark:text-white`}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <input
                            type="submit"
                            required
                            value="Update"
                            className={`w-11/12 h-10 border border-teal-500 text-center dark:text-white text-black rounded-[3px] mt-8 cursor-pointer ${
                                isLoading ? "animate-pulse opacity-70 !cursor-not-allowed" : ""
                            }`}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
