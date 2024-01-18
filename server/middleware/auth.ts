import { Request, Response, NextFunction } from "express";
import catchAsyncErrors from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

// check if user is authenticated or not
export const isAuthenticated = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.cookies.access_token;

        if (!accessToken) {
            return next(new ErrorHandler("Please login to access this resource", 401));
        }

        const decoded = jwt.verify(
            accessToken,
            process.env.JWT_ACCESS_SECRET as string
        ) as JwtPayload;

        if (!decoded) {
            return next(new ErrorHandler("Invalid access token", 401));
        }

        const user = await redis.get(decoded.id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        req.user = JSON.parse(user);

        next();
    }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req?.user?.role || "")) {
            return next(
                new ErrorHandler(
                    `Role '${req?.user?.role}' is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};
