import { styles } from "@/app/styles/style";
import React, { FC, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { BsLink45Deg, BsPencil } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

type Props = {
    active: number;
    setActive: (value: number) => void;
    courseContentData: any[];
    setCourseContentData: (value: any) => void;
    handleSubmit: any;
};

const CourseContent: FC<Props> = ({
    active,
    setActive,
    courseContentData,
    setCourseContentData,
    handleSubmit: handleCourseSubmit,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(
        Array(courseContentData.length).fill(false)
    ); // Array of length courseContentData.length filled with false

    const [activeSection, setActiveSection] = useState(1);

    const handleSubmit = (e: any) => {
        e.preventDefault();
    };

    const handleCollapseToggle = (index: number) => {
        const newCollapsed = [...isCollapsed];
        newCollapsed[index] = !newCollapsed[index];
        setIsCollapsed(newCollapsed);
    };

    const handleRemoveLink = (contentIndex: number, linkIndex: number) => {
        const newContent = [...courseContentData];
        newContent[contentIndex].links.splice(linkIndex, 1);
        setCourseContentData(newContent);
    };

    const handleAddLink = (index: number) => {
        const newContent = [...courseContentData];
        newContent[index].links.push({ title: "", url: "" });
        setCourseContentData(newContent);
    };

    const addNewContentHandler = (content: any) => {
        if (
            content?.title === "" ||
            content?.description === "" ||
            content?.videoUrl === "" ||
            content?.links?.some((link: any) => link.title === "" || link.url === "")
        ) {
            toast.error("Please fill the current content before adding a new one");
        } else {
            let newVideoSection = "";

            if (courseContentData.length > 0) {
                const lastVideoSection =
                    courseContentData[courseContentData.length - 1].videoSection;

                // use the last video section if available else use user input
                if (lastVideoSection) {
                    newVideoSection = lastVideoSection;
                }
            }

            const newContent = {
                videoUrl: "",
                title: "",
                description: "",
                videoSection: newVideoSection,
                links: [{ title: "", url: "" }],
            };

            setCourseContentData([...courseContentData, newContent]);
        }
    };

    const handleAddNewSection = () => {
        if (
            courseContentData[courseContentData.length - 1]?.title === "" ||
            courseContentData[courseContentData.length - 1]?.description === "" ||
            courseContentData[courseContentData.length - 1]?.videoUrl === "" ||
            courseContentData[courseContentData.length - 1]?.links?.some(
                (link: any) => link.title === "" || link.url === ""
            )
        ) {
            toast.error("Please fill all the fields before adding a new section");
            return;
        }

        setActiveSection(activeSection + 1);

        const newContent = {
            videoUrl: "",
            title: "",
            description: "",
            videoSection: `Untitled Section ${activeSection + 1}`,
            links: [{ title: "", url: "" }],
        };

        setCourseContentData([...courseContentData, newContent]);
    };

    const handlePrevButton = () => {
        setActive(active - 1);
    };

    const handleOptions = () => {
        const emptyContent = courseContentData.some(
            (content) =>
                content.title === "" ||
                content.description === "" ||
                content.videoUrl === "" ||
                content.links.some((link: any) => link.title === "" || link.url === "")
        );

        if (emptyContent) {
            toast.error("Please fill all the fields");
            return;
        }

        setActive(active + 1);
        handleCourseSubmit();
    };

    return (
        <div className="w-4/5 m-auto mt-24 p-3">
            <form onSubmit={handleSubmit}>
                {courseContentData?.map((content: any, index: number) => {
                    const showSectionInput =
                        index === 0 ||
                        content?.videoSection !== courseContentData[index - 1]?.videoSection; // If the current section is the first section or the current section is different from the previous section, show the section input

                    return (
                        <div key={`video-content-${index}`}>
                            <div
                                className={`w-full bg-gray-800 p-4 ${
                                    showSectionInput ? "mt-10 rounded-t-lg" : "mb-0"
                                }`}
                            >
                                {showSectionInput && (
                                    <>
                                        <div className="flex w-full items-center">
                                            <input
                                                type="text"
                                                name={`video-section-${index}`}
                                                id={`video-section-${index}`}
                                                className={`text-xl ${
                                                    content?.videoSection ===
                                                    "Untitled Section"
                                                        ? "w-44"
                                                        : "w-full"
                                                } font-Poppins cursor-pointer dark:text-white text-black bg-transparent outline-none`}
                                                value={content?.videoSection}
                                                onChange={(e) => {
                                                    const newContent = [...courseContentData];
                                                    newContent[index].videoSection =
                                                        e.target.value;
                                                    setCourseContentData(newContent);
                                                }}
                                            />

                                            <BsPencil
                                                className="cursor-pointer dark:text-white text-black"
                                                // on click, focus on the input field
                                                onClick={() => {
                                                    const input = document.getElementById(
                                                        `video-section-${index}`
                                                    ) as HTMLInputElement;
                                                    input?.focus();
                                                }}
                                            />
                                        </div>
                                        <br />
                                    </>
                                )}
                                <div className="flex w-full items-center justify-between my-0">
                                    {isCollapsed[index] ? (
                                        <>
                                            {content?.title ? (
                                                <p className="font-Poppins dark:text-white text-black">
                                                    {index + 1}. {content?.title}
                                                </p>
                                            ) : (
                                                <></>
                                            )}
                                        </>
                                    ) : (
                                        <div></div>
                                    )}

                                    {/* arrow button for collapsed video content */}
                                    <div className="flex items-center">
                                        <AiOutlineDelete
                                            className={`dark:text-white text-xl mr-2 text-black ${
                                                index > 0 ? "cursor-pointer" : "cursor-no-drop"
                                            }`}
                                            onClick={() => {
                                                if (index > 0) {
                                                    const newContent = [...courseContentData];
                                                    newContent.splice(index, 1); // Remove the content at the index
                                                    setCourseContentData(newContent);
                                                }
                                            }}
                                        />

                                        <MdOutlineKeyboardArrowDown
                                            fontSize="large"
                                            className={`dark:text-white text-black cursor-pointer ${
                                                isCollapsed[index]
                                                    ? "transform rotate-180"
                                                    : "transform rotate-0"
                                            }`}
                                            onClick={() => {
                                                handleCollapseToggle(index);
                                            }}
                                        />
                                    </div>
                                </div>

                                {!isCollapsed[index] && (
                                    <>
                                        <div className="my-3">
                                            <label
                                                htmlFor={`video-title-${index}`}
                                                className={styles.label}
                                            >
                                                Video Title
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={`Video Title ${index + 1}`}
                                                name={`video-title-${index}`}
                                                id={`video-title-${index}`}
                                                className={styles.input}
                                                value={content?.title}
                                                onChange={(e) => {
                                                    const newContent = [...courseContentData];
                                                    newContent[index].title = e.target.value;
                                                    setCourseContentData(newContent);
                                                }}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor={`video-url-${index}`}
                                                className={styles.label}
                                            >
                                                Video URL
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={`Video URL ${index + 1}`}
                                                name={`video-url-${index}`}
                                                id={`video-url-${index}`}
                                                className={styles.input}
                                                value={content?.videoUrl}
                                                onChange={(e) => {
                                                    const newContent = [...courseContentData];
                                                    newContent[index].videoUrl =
                                                        e.target.value;
                                                    setCourseContentData(newContent);
                                                }}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label
                                                htmlFor={`video-url-${index}`}
                                                className={styles.label}
                                            >
                                                Video Description
                                            </label>
                                            <textarea
                                                rows={8}
                                                cols={30}
                                                placeholder={`Video Description ${index + 1}`}
                                                name={`video-description-${index}`}
                                                id={`video-description-${index}`}
                                                className={`${styles.input} resize-none !h-min py-2`}
                                                value={content?.description}
                                                onChange={(e) => {
                                                    const newContent = [...courseContentData];
                                                    newContent[index].description =
                                                        e.target.value;
                                                    setCourseContentData(newContent);
                                                }}
                                            />
                                            <br />
                                        </div>
                                        {content?.links?.map(
                                            (link: any, linkIndex: number) => (
                                                <div
                                                    className="mb-3 block"
                                                    key={`link-${index}-${linkIndex}`}
                                                >
                                                    <div className="w-full flex items-center justify-between">
                                                        <label
                                                            htmlFor={`link-${index}-${linkIndex}`}
                                                            className={styles.label}
                                                        >
                                                            Link {linkIndex + 1}
                                                        </label>
                                                        <AiOutlineDelete
                                                            className={`${
                                                                linkIndex > 0
                                                                    ? "cursor-pointer"
                                                                    : "cursor-no-drop"
                                                            } dark:text-white text-black text-xl`}
                                                            onClick={() => {
                                                                if (linkIndex > 0) {
                                                                    handleRemoveLink(
                                                                        index,
                                                                        linkIndex
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder={`Link ${
                                                            linkIndex + 1
                                                        } Title`}
                                                        name={`link-${index}-${linkIndex}`}
                                                        id={`link-${index}-${linkIndex}`}
                                                        className={styles.input}
                                                        value={link?.title}
                                                        onChange={(e) => {
                                                            const newContent = [
                                                                ...courseContentData,
                                                            ];
                                                            newContent[index].links[
                                                                linkIndex
                                                            ].title = e.target.value;
                                                            setCourseContentData(newContent);
                                                        }}
                                                    />
                                                    <input
                                                        type="url"
                                                        placeholder={`Link ${
                                                            linkIndex + 1
                                                        } URL`}
                                                        name={`link-${index}-${linkIndex}`}
                                                        id={`link-${index}-${linkIndex}`}
                                                        className={`${styles.input} mt-6`}
                                                        value={link?.url}
                                                        onChange={(e) => {
                                                            const newContent = [
                                                                ...courseContentData,
                                                            ];
                                                            newContent[index].links[
                                                                linkIndex
                                                            ].url = e.target.value;
                                                            setCourseContentData(newContent);
                                                        }}
                                                    />
                                                </div>
                                            )
                                        )}
                                        <br />
                                        {/* add link button */}
                                        <div className="inline-block mb-4">
                                            <p
                                                className="flex items-center text-lg dark:text-white text-black cursor-pointer"
                                                onClick={() => handleAddLink(index)}
                                            >
                                                <BsLink45Deg className="mr-2" /> Add Link
                                            </p>
                                        </div>
                                    </>
                                )}
                                <br />
                                {/* add new content */}
                                {index === courseContentData.length - 1 && ( // If the current index is the last index
                                    <div>
                                        <p
                                            className="flex items-center text-lg dark:text-white text-black cursor-pointer"
                                            onClick={(e: any) => addNewContentHandler(content)}
                                        >
                                            <AiOutlinePlusCircle className="mr-2" /> Add New
                                            Content
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                <br />

                <div
                    className="flex items-center text-xl dark:text-white text-black cursor-pointer"
                    onClick={() => handleAddNewSection()}
                >
                    <AiOutlinePlusCircle className="mr-2" /> Add New Section
                </div>
            </form>

            <br />

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
            <br />
            <br />
        </div>
    );
};

export default CourseContent;
