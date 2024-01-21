import { Response } from "express";
import Course from "../models/course.model";
import catchAsyncErrors from "../middleware/catchAsyncErrors";

// Create course
export const createCourse = catchAsyncErrors(async (data: any, res: Response) => {
    const course = await Course.create(data);

    res.status(201).json({
        success: true,
        course,
    });
});

// Get all courses
export const getAllCoursesService = async (res: Response) => {
    const courses = await Course.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        courses,
    });
};
