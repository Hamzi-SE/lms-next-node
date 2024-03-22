import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";

type Props = {
    active: number;
    setActive: (value: number) => void;
};

const CourseOptions: FC<Props> = ({ active, setActive }) => {
    const options = [
        "Course Information",
        "Course Options",
        "Course Content",
        "Course Preview",
    ];

    return (
        <div>
            {options.map((option: string, index: number) => (
                <div key={index} className={`w-full flex py-5`}>
                    <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            active + 1 > index ? "bg-blue-500" : "bg-gray-500"
                        } relative`}
                    >
                        <IoMdCheckmark className="text-2xl" />
                        {index !== options.length - 1 && (
                            <div
                                className={`absolute h-8 w-1 ${
                                    active + 1 > index ? "bg-blue-500" : "bg-gray-500"
                                } -bottom-full`}
                            />
                        )}
                    </div>
                    <h5
                        className={`pl-3 ${
                            active === index
                                ? "dark:text-white text-black"
                                : "dark:text-gray-300 text-gray-700"
                        } text-xl`}
                    >
                        {option}
                    </h5>
                </div>
            ))}
        </div>
    );
};

export default CourseOptions;
