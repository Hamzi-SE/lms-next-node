"use client";

import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "@/app/styles/style";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

type Props = {
    setRoute: (route: string) => void;
    setOpen: (open: boolean) => void;
};

const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password should be atleast 6 characters"),
});

const Login: FC<Props> = ({ setRoute, setOpen }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading, isSuccess, isError, data, error }] = useLoginMutation();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            await login({ email, password });
        },
    });

    useEffect(() => {
        if (isSuccess) {
            toast.success("Logged in successfully");
            setOpen(false);
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message || "Invalid credentials");
            }
        }
    }, [isSuccess, error, data?.message, setOpen]);

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="w-full">
            <h1 className={`${styles.title}`}>Login with LMS</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email" className={`${styles.label}`}>
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    id="email"
                    placeholder="john@mail.com"
                    className={`${errors.email && touched.email && "border-red-500"} ${
                        styles.input
                    }`}
                />
                {errors.email && touched.email && (
                    <span className="text-red-500 pt-2 block">{errors.email}</span>
                )}
                <div className="w-full mt-5 relative mb-1">
                    <label htmlFor="password" className={`${styles.label}`}>
                        Password
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        id="password"
                        placeholder="********"
                        className={`${
                            errors.password && touched.password && "border-red-500"
                        } ${styles.input}`}
                    />
                    {!showPassword ? (
                        <AiOutlineEyeInvisible
                            size={20}
                            onClick={() => setShowPassword(true)}
                            className="absolute bottom-3 right-2 z-1 cursor-pointer"
                        />
                    ) : (
                        <AiOutlineEye
                            size={20}
                            onClick={() => setShowPassword(false)}
                            className="absolute bottom-3 right-2 z-1 cursor-pointer"
                        />
                    )}
                    {errors.password && touched.password && (
                        <span className="text-red-500 pt-2 block">{errors.password}</span>
                    )}
                </div>
                <div className="w-full mt-5">
                    <input type="submit" value="Login" className={`${styles.button}`} />
                </div>
                <br />
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Or login with
                </h5>
                <div className="flex items-center justify-center my-3">
                    <FcGoogle
                        size={30}
                        className="mr-3 cursor-pointer"
                        onClick={() => signIn("google")}
                    />
                    <AiFillGithub
                        size={30}
                        className="cursor-pointer invert dark:invert-0"
                        onClick={() => signIn("github")}
                    />
                </div>
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Don&apos;t have an account?{" "}
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer"
                        onClick={() => setRoute("Sign-Up")}
                    >
                        Sign up
                    </span>
                </h5>
            </form>
            <br />
        </div>
    );
};

export default Login;
