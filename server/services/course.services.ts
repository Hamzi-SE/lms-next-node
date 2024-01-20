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
