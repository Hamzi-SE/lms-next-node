import { NextFunction, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import Order from "../models/order.model";

// create new order
export const newOrder = catchAsyncErrors(
    async (data: any, res: Response, next: NextFunction) => {
        const order = await Order.create(data);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    }
);

// get all orders - admin
export const getAllOrdersService = async (res: Response) => {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        orders,
    });
};
