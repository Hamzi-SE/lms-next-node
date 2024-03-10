"use client";

import React, { FC, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineEyeInvisible, AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { styles } from "@/app/styles/style";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import toast from "react-hot-toast";

type Props = {
    setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
        .required("Password is required")
        .min(6, "Password should be atleast 6 characters"),
});

const SignUp: FC<Props> = ({ setRoute }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [register, { error, isSuccess, data, isLoading }] = useRegisterMutation();

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
        },
        validationSchema: schema,
        onSubmit: async ({ name, email, password }) => {
            const data = { name, email, password };

            await register(data);
        },
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    useEffect(() => {
        if (isSuccess) {
            const message = data?.message || "Registration successful";
            toast.success(message);
            setRoute("Verification");
        }

        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message || "An error occurred while registering");
            }
        }
    }, [isSuccess, error, data?.message, setRoute]);

    return (
        <div className="w-full">
            <h1 className={`${styles.title}`}>Join the LMS community</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className={`${styles.label}`}>
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        id="name"
                        placeholder="John Doe"
                        className={`${errors.name && touched.name && "border-red-500"} ${
                            styles.input
                        }`}
                    />
                    {errors.name && touched.name && (
                        <span className="text-red-500 pt-2 block">{errors.name}</span>
                    )}
                </div>
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
                            className="absolute bottom-3 right-2 z-1 cursor-pointer invert dark:invert-0"
                        />
                    ) : (
                        <AiOutlineEye
                            size={20}
                            onClick={() => setShowPassword(false)}
                            className="absolute bottom-3 right-2 z-1 cursor-pointer invert dark:invert-0"
                        />
                    )}
                </div>
                {errors.password && touched.password && (
                    <span className="text-red-500 pt-2 block">{errors.password}</span>
                )}
                <div className="w-full mt-5">
                    <input
                        disabled={isLoading}
                        type="submit"
                        value="Sign Up"
                        className={`${styles.button} ${
                            isLoading && "cursor-not-allowed opacity-50"
                        }`}
                    />
                </div>
                <br />
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Or register with
                </h5>
                <div className="flex items-center justify-center my-3">
                    <FcGoogle size={30} className="mr-3 cursor-pointer" />
                    <AiFillGithub size={30} className="cursor-pointer invert dark:invert-0" />
                </div>
                <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                    Already have an account?
                    <span
                        className="text-[#2190ff] pl-1 cursor-pointer"
                        onClick={() => setRoute("Login")}
                    >
                        Sign in
                    </span>
                </h5>
            </form>
            <br />
        </div>
    );
};

export default SignUp;
