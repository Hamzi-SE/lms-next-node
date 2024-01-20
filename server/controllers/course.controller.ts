import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.services";
import Course from "../models/course.model";

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
