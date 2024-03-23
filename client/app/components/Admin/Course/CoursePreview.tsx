import { styles } from "@/app/styles/style";
import CoursePlayer from "@/app/utils/CoursePlayer";
import Ratings from "@/app/utils/Ratings";
import React, { FC } from "react";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

type Props = {
    active: number;
    setActive: (active: number) => void;
    courseData: any;
    handleCourseCreate: () => void;
};

const CoursePreview: FC<Props> = ({ active, setActive, courseData, handleCourseCreate }) => {
    const discountPercentagePrice = (price: number, estimatedPrice: number) => {
        return Math.floor(((estimatedPrice - price) / estimatedPrice) * 100).toFixed(0);
    };

    const handlePrevButton = () => {
        setActive(active - 1);
    };

    const createCourse = () => {
        handleCourseCreate();
    };

    return (
        <div className="w-11/12 m-auto py-5 mb-5">
            <div className="w-full relative">
                <div className="w-full mt-10">
                    <CoursePlayer videoUrl={courseData?.demoUrl} title={courseData?.title} />
                </div>
                <div className="flex items-center text-black dark:text-white">
                    <h1 className="pt-5 text-2xl">
                        {courseData?.price === 0 ? "Free" : `$${courseData?.price}`}
                    </h1>

                    <h5 className="pl-3 text-xl mt-2 line-through opacity-80">
                        {`$${courseData?.estimatedPrice}`}
                    </h5>

                    <h4 className="pl-5 pt-4 text-2xl">
                        {discountPercentagePrice(
                            courseData?.price,
                            courseData?.estimatedPrice
                        )}{" "}
                        % off!
                    </h4>
                </div>

                <div className="flex items-center">
                    <div
                        className={`${styles.button} !w-48 my-3 font-Poppins !bg-[crimson] !cursor-not-allowed`}
                    >
                        Buy Now for{" "}
                        {courseData?.price === 0 ? "Free" : `$${courseData?.price}`}
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        type="text"
                        placeholder="Discount Code"
                        className={`${styles.input} 1500px:!w-1/2 1100px:!w-3/5 my-3 ml-4 font-Poppins`}
                        name="discountCode"
                        id="discountCode"
                    />
                    <div className={`${styles.button} !w-32 my-3 ml-4 font-Poppins`}>
                        Apply
                    </div>
                </div>
                <div className="text-black dark:text-white">
                    <p className="pb-1">● Source code included</p>
                    <p className="pb-1">● Full lifetime access</p>
                    <p className="pb-1">● Buy now, watch anytime</p>
                    <p className="pb-3 800px:pb-1">● Priority support</p>
                </div>
            </div>

            <div className="w-full text-black dark:text-white">
                <div className="w-full 800px:pr-5">
                    <h1 className="text-2xl font-Poppins font-semibold">{courseData?.name}</h1>
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center">
                            <Ratings rating={0} />
                            <h5>0 Reviews</h5>
                        </div>
                        <h5>0 Students</h5>
                    </div>

                    <br />

                    <h1 className="text-2xl font-Poppins font-semibold">
                        What you'll learn from this course?
                    </h1>
                </div>

                {courseData?.benefits?.map((benefit: { title: string }, index: number) => (
                    <div className="w-full flex 800px:items-center py-2" key={index}>
                        <div className="w-4 mr-1">
                            <IoCheckmarkDoneOutline size={20} color="#34D399" />
                        </div>
                        <p className="pl-2">
                            <span className="font-semibold">{benefit.title}</span>
                        </p>
                    </div>
                ))}
                <br />
                <br />

                <h1 className="text-2xl font-Poppins font-semibold">
                    What are the prerequisites for this course?
                </h1>

                {courseData?.prerequisites?.map(
                    (prerequisite: { title: string }, index: number) => (
                        <div className="w-full flex 800px:items-center py-2" key={index}>
                            <div className="w-4 mr-1">
                                <IoCheckmarkDoneOutline size={20} />
                            </div>
                            <p className="pl-2">
                                <span className="font-semibold">{prerequisite.title}</span>
                            </p>
                        </div>
                    )
                )}

                <br />
                <br />

                {/* course description */}
                <div className="w-full">
                    <h1 className="text-2xl font-Poppins font-semibold">Course Details</h1>
                    <p className="text-lg mt-5 whitespace-pre-line w-full overflow-hidden">
                        {courseData?.description}
                    </p>
                </div>
                <br />
                <br />
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
                    onClick={() => createCourse()}
                >
                    Create Course
                </div>
            </div>
        </div>
    );
};

export default CoursePreview;
