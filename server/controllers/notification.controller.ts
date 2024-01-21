import Notification from "../models/notification.model";
import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";

// Get notifications - only admin => /api/v1/notifications/
export const getNotifications = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const notifications = await Notification.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications,
        });
    }
);

// Update notification status - only admin => /api/v1/notifications/:id
export const updateNotification = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return next(new ErrorHandler("Notification not found", 404));
        }

        notification.status = "read";

        await notification.save();

        const notifications = await Notification.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications,
        });
    }
);
