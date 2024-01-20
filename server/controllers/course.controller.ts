import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.services";
import Course from "../models/course.model";
import { redis } from "../utils/redis";

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
