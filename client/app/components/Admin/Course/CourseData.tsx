import { styles } from "@/app/styles/style";
import React, { FC } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import toast from "react-hot-toast";

type Props = {
    benefits: { title: string }[];
    setBenefits: (value: { title: string }[]) => void;
    prerequisites: { title: string }[];
    setPrerequisites: (value: { title: string }[]) => void;
    active: number;
    setActive: (value: number) => void;
};

const CourseData: FC<Props> = ({
    benefits,
    setBenefits,
    prerequisites,
    setPrerequisites,
    active,
    setActive,
}) => {
    const handleBenefitChange = (index: number, value: string) => {
        const newBenefits = [...benefits];
        newBenefits[index].title = value;
        setBenefits(newBenefits);
    };

    const handlePrerequisiteChange = (index: number, value: string) => {
        const newPrerequisites = [...prerequisites];
        newPrerequisites[index].title = value;
        setPrerequisites(newPrerequisites);
    };

    const addBenefit = () => {
        setBenefits([...benefits, { title: "" }]);
    };

    const removeBenefit = (index: number) => {
        const newBenefits = [...benefits];
        newBenefits.splice(index, 1);
        setBenefits(newBenefits);
    };

    const addPrerequisite = () => {
        setPrerequisites([...prerequisites, { title: "" }]);
    };

    const removePrerequisite = (index: number) => {
        const newPrerequisites = [...prerequisites];
        newPrerequisites.splice(index, 1);
        setPrerequisites(newPrerequisites);
    };

    const handlePrevButton = () => {
        setActive(active - 1);
    };

    const handleOptions = () => {
        const emptyBenefit = benefits.some((benefit) => benefit.title === "");
        const emptyPrerequisite = prerequisites.some(
            (prerequisite) => prerequisite.title === ""
        );

        if (emptyBenefit || emptyPrerequisite) {
            toast.error("Please fill all the fields");
            return;
        }

        setActive(active + 1);
    };

    return (
        <div className="w-4/5 m-auto mt-24 block">
            <div>
                <label htmlFor="benefits" className={`${styles.label} text-xl`}>
                    What are the benefits of this course?
                </label>
                <br />
                {benefits.map((benefit: { title: string }, index: number) => (
                    <div className="relative" key={`benefit-${index}`}>
                        <input
                            type="text"
                            name="benefit"
                            placeholder="You will learn..."
                            required
                            value={benefit.title}
                            onChange={(e) => handleBenefitChange(index, e.target.value)}
                            className={`${styles.input} my-2`}
                        />
                        <RemoveCircleIcon
                            className="w-7 my-2.5 mx-0 cursor-pointer text-red-500 absolute right-2 top-1"
                            onClick={() => removeBenefit(index)}
                        />
                    </div>
                ))}
                <AddCircleIcon
                    className="w-7 my-2.5 mx-0 cursor-pointer"
                    onClick={addBenefit}
                />
            </div>

            <div>
                <label htmlFor="prerequisites" className={`${styles.label} text-xl`}>
                    What are the prerequisites of this course?
                </label>
                <br />
                {prerequisites.map((prerequisite: { title: string }, index: number) => (
                    <div className="relative" key={`prerequisite-${index}`}>
                        <input
                            type="text"
                            name="prerequisite"
                            placeholder="You will need..."
                            required
                            value={prerequisite.title}
                            onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                            className={`${styles.input} my-2`}
                        />
                        <RemoveCircleIcon
                            className="w-7 my-2.5 mx-0 cursor-pointer text-red-500 absolute right-2 top-1"
                            onClick={() => removePrerequisite(index)}
                        />
                    </div>
                ))}
                <AddCircleIcon
                    className="w-7 my-2.5 mx-0 cursor-pointer"
                    onClick={addPrerequisite}
                />
            </div>

            <div className="w-full flex items-center justify-between">
                <div
                    className="w-full 800px:w-44 flex items-center justify-center h-10 bg-teal-500 text-center text-white rounded mt-8 cursor-pointer"
                    onClick={() => handlePrevButton()}
                >
                    Prev
                </div>
                <div
                    className="w-full 800px:w-44 flex items-center justify-center h-10 bg-teal-500 text-center text-white rounded mt-8 cursor-pointer"
                    onClick={() => handleOptions()}
                >
                    Next
                </div>
            </div>
        </div>
    );
};

export default CourseData;
