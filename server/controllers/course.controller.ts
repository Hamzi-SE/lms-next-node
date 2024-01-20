import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.services";
import Course from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import { sendEmail } from "../utils/sendMail";

// Upload course => /api/v1/course/create
export const uploadCourse = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body;

        const thumbnail = data.thumbnail;

        if (thumbnail) {
            const result = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "lms-next-node-courses",
            });

            data.thumbnail = {
                url: result.secure_url,
                public_id: result.public_id,
            };
        }

        createCourse(data, res, next);
    }
);

// Update course => /api/v1/course/:id
export const updateCourse = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const data = req.body;

        const courseId = req.params.id;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const thumbnail = data.thumbnail;

        if (thumbnail) {
            // Delete previous image
            await cloudinary.v2.uploader.destroy(course?.thumbnail?.public_id);

            const result = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "lms-next-node-courses",
            });

            data.thumbnail = {
                url: result.secure_url,
                public_id: result.public_id,
            };
        }

        const updatedCourse = await Course.findOneAndUpdate(
            { _id: courseId },
            { $set: data },
            { new: true, runValidators: true, useFindAndModify: false }
        );

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            course: updatedCourse,
        });
    }
);

// Get single course --- without purchase
export const getSingleCourse = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const courseId = req.params.id;

        const isCached = await redis.get(`course:${courseId}`);

        if (isCached) {
            const course = JSON.parse(isCached);

            return res.status(200).json({
                success: true,
                course,
            });
        }

        const course = await Course.findById(courseId).select(
            "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        await redis.set(`course:${courseId}`, JSON.stringify(course));

        res.status(200).json({
            success: true,
            course,
        });
    }
);

// Get all courses --- without purchase
export const getAllCourses = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const isCached = await redis.get("allCourses");

        if (isCached) {
            const courses = JSON.parse(isCached);

            return res.status(200).json({
                success: true,
                courses,
            });
        }

        const courses = await Course.find().select(
            "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );

        if (!courses) {
            return next(new ErrorHandler("Courses not found", 404));
        }

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({
            success: true,
            courses,
        });
    }
);

// Get course content --- with purchase
export const getCourseByUser = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const userCourses = req.user?.courses;

        const courseId = req.params.id;

        const courseExists = userCourses?.find(
            (course: any) => course._id.toString() === courseId
        );

        if (!courseExists) {
            return next(new ErrorHandler("You are not enrolled in this course", 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const content = course.courseData;

        res.status(200).json({
            success: true,
            content,
        });
    }
);

// Add question to course
interface IAddQuestionData {
    question: string;
    courseId: string;
    contentId: string;
}

export const addQuestion = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { question, courseId, contentId }: IAddQuestionData = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        }

        const courseContent = course.courseData.find((item: any) =>
            item._id.equals(contentId)
        );

        if (!courseContent) {
            return next(new ErrorHandler("Content not found", 404));
        }

        const questionData: any = {
            question,
            questionReplies: [],
            user: req.user,
        };

        // add question to course
        courseContent.questions.push(questionData);

        await course.save();

        res.status(200).json({
            success: true,
            message: "Question added successfully",
            course,
        });
    }
);

// Add answer to question in course
interface IAddAnswerData {
    answer: string;
    courseId: string;
    contentId: string;
    questionId: string;
}
export const addAnswer = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        }

        const courseContent = course.courseData.find((item: any) =>
            item._id.equals(contentId)
        );

        if (!courseContent) {
            return next(new ErrorHandler("Content not found", 404));
        }

        const question = courseContent.questions.find((item: any) =>
            item._id.equals(questionId)
        );

        if (!question) {
            return next(new ErrorHandler("Question not found", 404));
        }

        const answerData: any = {
            answer,
            user: req.user,
        };

        // add answer to question
        question.questionReplies?.push(answerData);

        await course.save();

        if (req.user?._id.toString() === question.user._id.toString()) {
            // create notification
        } else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };

            // send email
            try {
                await sendEmail({
                    email: question.user.email,
                    subject: "Question reply",
                    template: "question-reply",
                    data,
                });
            } catch (error: any) {
                return next(new ErrorHandler(error.message || "Something went wrong", 500));
            }
        }

        res.status(200).json({
            success: true,
            message: "Answer added successfully",
            course,
        });
    }
);
