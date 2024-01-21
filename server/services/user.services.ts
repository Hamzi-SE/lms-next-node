import { Response } from "express";
import { redis } from "../utils/redis";
import User from "../models/user.model";

// get user by id
export const getUserById = async (id: string, res: Response) => {
    const userJSON = await redis.get(id);

    if (!userJSON) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    const user = JSON.parse(userJSON);
    return res.status(200).json({
        success: true,
        user,
    });
};

// get all users
export const getAllUsersService = async (res: Response) => {
    const users = await User.find().sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        users,
    });
};
