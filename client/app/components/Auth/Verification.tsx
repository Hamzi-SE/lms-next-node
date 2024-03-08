import { styles } from "@/app/styles/style";
import React, { FC, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";

type Props = {
    setRoute: (route: string) => void;
};

type VerifyNumber = {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
};

const Verification: FC<Props> = ({ setRoute }) => {
    const [invalid, setInvalid] = useState(false);
    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        0: "",
        1: "",
        2: "",
        3: "",
    });

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const verificationHandler = async () => {
        setInvalid(true);
        console.log(inputRefs);
    };

    const handleInputChange = (index: number, value: string) => {
        setInvalid(false);
        const newVerifyNumber = { ...verifyNumber, [index]: value };
        setVerifyNumber(newVerifyNumber);

        if (value === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        } else if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current?.focus();
        } else if (value.length === 1 && index === 3) {
            inputRefs[index].current?.blur();
        }
    };

    return (
        <div>
            <h1 className={`${styles.title}`}>Verify Your Account</h1>
            <br />
            <div className="w-full flex items-center justify-center mt-2">
                <div className="w-20 h-20 rounded-full bg-[#497DF2] flex items-center justify-center">
                    <VscWorkspaceTrusted size={40} />
                </div>
            </div>

            <br />
            <br />

            <div className="m-auto flex items-center justify-around">
                {Object.keys(verifyNumber).map((key, index) => (
                    <input
                        type="number"
                        key={key}
                        ref={inputRefs[index]}
                        value={verifyNumber[key as keyof VerifyNumber]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={`w-16 h-16 bg-transparent border-2 rounded-lg flex items-center text-black dark:text-white justify-center text-sm font-Poppins outline-none text-center ${
                            invalid
                                ? "animate-shake border-red-500"
                                : "dark:border-white border-[#0000004a]"
                        }`}
                        placeholder=""
                        maxLength={1}
                    />
                ))}
            </div>
            <br />
            <br />
            <div className="w-full flex justify-center">
                <button className={`${styles.button}`} onClick={verificationHandler}>
                    Verify OTP
                </button>
            </div>
            <br />
            <h5 className="text-center pt-4 font-Poppins text-[14px] text-black dark:text-white">
                Go back to{" "}
                <span
                    onClick={() => setRoute("Login")}
                    className="text-blue-500 cursor-pointer pl-1"
                >
                    Sign in
                </span>
            </h5>
        </div>
    );
};

export default Verification;
