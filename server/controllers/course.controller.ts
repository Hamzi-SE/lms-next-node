import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService } from "../services/course.services";
import Course from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs";
import path from "path";
import { sendEmail } from "../utils/sendMail";
import Notification from "../models/notification.model";
import axios from "axios";

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

        await redis.set(`course:${courseId}`, JSON.stringify(course), "EX", 604800); // 7 days

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

        await Notification.create({
            user: req.user?._id,
            title: "New question received",
            message: `${req.user?.name} has asked a question in ${course.name} - ${courseContent.title}}`,
        });

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
            await Notification.create({
                user: req.user?._id,
                title: "New question reply received",
                message: `${req.user?.name} has replied in ${course.name} - ${courseContent.title}`,
            });
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

// Add review in course
interface IAddReviewData {
    review: string;
    rating: number;
}

export const addReview = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { review, rating }: IAddReviewData = req.body;

        const userCourseList = req.user?.courses;
        const courseId = req.params.id;

        const courseExists = userCourseList?.some(
            (course: any) => course._id.toString() === courseId
        );

        if (!courseExists) {
            return next(new ErrorHandler("You are not enrolled in this course", 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const reviewData: any = {
            user: req.user,
            comment: review,
            rating,
        };

        // add review to course
        course.reviews.push(reviewData);

        let avg = 0;

        course.reviews.forEach((item: any) => {
            avg += item.rating;
        });

        course.ratings = avg / course.reviews.length; // e.g. 9/2 = 4.5

        await course.save();

        // create notification
        await Notification.create({
            user: req.user?._id,
            title: "New review received",
            message: `${req.user?.name} has added a review in ${course.name}`,
        });

        res.status(200).json({
            success: true,
            message: "Review added successfully",
            course,
        });
    }
);

// Add reply to review in course
interface IAddReplyToReviewData {
    comment: string;
    courseId: string;
    reviewId: string;
}
export const addReplyToReview = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { comment, courseId, reviewId }: IAddReplyToReviewData = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const review = course.reviews.find((item: any) => item._id.toString() === reviewId);

        if (!review) {
            return next(new ErrorHandler("Review not found", 404));
        }

        const replyData: any = {
            user: req.user,
            comment,
        };

        // add reply to review
        if (!review.commentReplies) {
            review.commentReplies = [];
        }

        review.commentReplies.push(replyData);

        await course.save();

        res.status(200).json({
            success: true,
            message: "Reply added successfully",
            course,
        });
    }
);

// Get all courses - admin => /api/v1/courses/admin-all
export const getAllCoursesAdmin = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        getAllCoursesService(res);
    }
);

// Delete course - admin => /api/v1/courses/delete/:id
export const deleteCourseAdmin = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const courseId = req.params.id;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        await course.deleteOne({ _id: courseId });

        // Delete course thumbnail from cloudinary
        course?.thumbnail?.public_id &&
            (await cloudinary.v2.uploader.destroy(course.thumbnail.public_id));

        // Delete course from redis
        await redis.del(`course:${courseId}`);

        res.status(200).json({
            success: true,
            message: `Course (${course.name}) deleted successfully`,
        });
    }
);

// generate video url
export const generateVideoUrl = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { videoId } = req.body;
        const response = await axios.post(
            `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
            { ttl: 300 },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
                },
            }
        );

        res.status(200).json({
            success: true,
            data: response.data,
        });
    }
);
