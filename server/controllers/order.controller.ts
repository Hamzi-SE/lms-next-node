import { Request, Response, NextFunction } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import Order, { IOder } from "../models/order.model";
import User from "../models/user.model";
import Course from "../models/course.model";
import Notification from "../models/notification.model";
import path from "path";
import ejs from "ejs";
import { sendEmail } from "../utils/sendMail";
import { getAllOrdersService, newOrder } from "../services/order.services";

// Create order
export const createOrder = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { courseId, payment_info } = req.body as IOder;

        const user = await User.findById(req.user?._id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const courseExistInUser = user.courses.some(
            (course: any) => course._id.toString() === courseId
        );

        if (courseExistInUser) {
            return next(new ErrorHandler("You already have this course", 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const data: any = {
            courseId: course._id,
            userId: user._id,
            payment_info,
        };

        const mailData = {
            order: {
                _id: course._id.toString().slice(0, 6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }), // e.g., January 21, 2024
            },
        };

        try {
            await sendEmail({
                email: user.email,
                subject: "Order Confirmation",
                data: mailData,
                template: "order-confirmation",
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message || "Something went wrong", 500));
        }

        user.courses.push(course?._id);

        await user.save();

        await Notification.create({
            userId: user._id,
            title: "New Order",
            message: `You have a new order for ${course.name}`,
        });

        course.purchased ? (course.purchased += 1) : (course.purchased = 1);

        await course.save();

        newOrder(data, res, next);
    }
);

// Get all orders - admin => /api/v1/order/admin-all
export const getAllOrdersAdmin = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        getAllOrdersService(res);
    }
);
