import { styles } from "@/app/styles/style";
import React, { FC, useState } from "react";

type Props = {
    courseInfo: any;
    setCourseInfo: (value: any) => void;
    active: number;
    setActive: (value: number) => void;
};

const CourseInformation: FC<Props> = ({ courseInfo, setCourseInfo, active, setActive }) => {
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (reader.readyState === 2) {
                    setCourseInfo({ ...courseInfo, thumbnail: e.target.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setDragging(false);
    };

    const handleDrop = (e: any) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                if (reader.readyState === 2) {
                    setCourseInfo({ ...courseInfo, thumbnail: e.target.result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setActive(active + 1);
    };

    return (
        <div className="w-4/5 m-auto mt-24">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="course-name" className={`${styles.label}`}>
                        Course Name
                    </label>
                    <input
                        type="text"
                        name="course-name"
                        id="course-name"
                        value={courseInfo.name}
                        required
                        onChange={(e) =>
                            setCourseInfo({ ...courseInfo, name: e.target.value })
                        }
                        className={`${styles.input}`}
                        placeholder="MERN Stack LMS platform with Next.js 14 and TypeScript"
                    />
                </div>

                <br />

                <div className="mb-5">
                    <label htmlFor="course-description" className={`${styles.label}`}>
                        Course Description
                    </label>
                    <textarea
                        name="course-description"
                        id="course-description"
                        cols={30}
                        rows={8}
                        value={courseInfo.description}
                        required
                        onChange={(e) =>
                            setCourseInfo({ ...courseInfo, description: e.target.value })
                        }
                        className={`${styles.input} !h-min py-2`}
                        placeholder="This is a comprehensive course on MERN stack development using Next.js 14 and TypeScript. It is designed to help you build a complete LMS platform from scratch."
                    />
                </div>

                <br />

                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label htmlFor="course-price" className={`${styles.label}`}>
                            Course Price
                        </label>
                        <input
                            type="number"
                            name="course-price"
                            id="course-price"
                            value={courseInfo.price}
                            required
                            onChange={(e) =>
                                setCourseInfo({ ...courseInfo, price: e.target.value })
                            }
                            className={`${styles.input}`}
                            placeholder="49"
                        />
                    </div>
                    <div className="w-6/12">
                        <label htmlFor="course-estimatedPrice" className={`${styles.label}`}>
                            Estimated Price (optional)
                        </label>
                        <input
                            type="text"
                            name="course-estimatedPrice"
                            id="course-estimatedPrice"
                            value={courseInfo.estimatedPrice}
                            required
                            onChange={(e) =>
                                setCourseInfo({
                                    ...courseInfo,
                                    estimatedPrice: e.target.value,
                                })
                            }
                            className={`${styles.input}`}
                            placeholder="99"
                        />
                    </div>
                </div>

                <br />

                <div>
                    <label htmlFor="course-tags" className={`${styles.label}`}>
                        Course Tags
                    </label>

                    <input
                        type="text"
                        name="course-tags"
                        id="course-tags"
                        value={courseInfo.tags}
                        required
                        onChange={(e) =>
                            setCourseInfo({ ...courseInfo, tags: e.target.value })
                        }
                        className={`${styles.input}`}
                        placeholder="MERN, Next.js, TypeScript, LMS, Tailwind CSS, Socket.io"
                    />
                </div>

                <br />

                <div className="w-full flex justify-between">
                    <div className="w-[45%]">
                        <label htmlFor="course-price" className={`${styles.label}`}>
                            Course Level
                        </label>
                        <input
                            type="text"
                            name="course-level"
                            id="course-level"
                            value={courseInfo.level}
                            required
                            onChange={(e) =>
                                setCourseInfo({ ...courseInfo, level: e.target.value })
                            }
                            className={`${styles.input}`}
                            placeholder="Beginner / Intermediate / Advanced"
                        />
                    </div>
                    <div className="w-6/12">
                        <label htmlFor="course-estimatedPrice" className={`${styles.label}`}>
                            Demo URL
                        </label>
                        <input
                            type="text"
                            name="course-demoUrl"
                            id="course-demoUrl"
                            value={courseInfo.demoUrl}
                            required
                            onChange={(e) =>
                                setCourseInfo({
                                    ...courseInfo,
                                    demoUrl: e.target.value,
                                })
                            }
                            className={`${styles.input}`}
                            placeholder="eer74fa"
                        />
                    </div>
                </div>

                <br />

                <div className="w-full">
                    <input
                        type="file"
                        accept="image/*"
                        id="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <label
                        htmlFor="course-thumbnail"
                        className={`w-full min-h-[10vh] dark:border-white border-gray-500 p-3 border flex items-center justify-center ${
                            dragging ? "bg-blue-500" : "bg-transparent"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {courseInfo.thumbnail ? (
                            <img
                                src={courseInfo.thumbnail}
                                alt="Thumbnail"
                                className="w-full max-h-full object-cover"
                            />
                        ) : (
                            <p className="text-center text-black dark:text-white">
                                Drag and drop or click to upload thumbnail
                            </p>
                        )}
                    </label>
                </div>

                <br />

                <div className="w-full flex items-center justify-end">
                    <input
                        type="submit"
                        value="Next"
                        className="w-full 800px:w-44 h-10 bg-teal-500 text-center text-white rounded mt-8 cursor-pointer"
                    />
                </div>
            </form>
        </div>
    );
};

export default CourseInformation;
