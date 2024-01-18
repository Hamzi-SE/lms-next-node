import { Response } from "express";
import { redis } from "../utils/redis";

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
