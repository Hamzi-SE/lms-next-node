import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import User from "../models/user.model";
import Course from "../models/course.model";
import Order from "../models/order.model";

// Get users analytics - only admin => /api/v1/analytics/users
export const getUsersAnalytics = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const users = await generateLast12MonthsData(User);
        res.status(200).json({
            success: true,
            users,
        });
    }
);

// Get courses analytics - only admin => /api/v1/analytics/courses
export const getCoursesAnalytics = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const courses = await generateLast12MonthsData(Course);
        res.status(200).json({
            success: true,
            courses,
        });
    }
);

// Get orders analytics - only admin => /api/v1/analytics/orders
export const getOrdersAnalytics = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const orders = await generateLast12MonthsData(Order);
        res.status(200).json({
            success: true,
            orders,
        });
    }
);
