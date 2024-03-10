import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route";
import courseRoutes from "./routes/course.route";
import orderRoutes from "./routes/order.route";
import notificationRoutes from "./routes/notification.route";
import analyticsRoutes from "./routes/analytics.route";
import layoutRoutes from "./routes/layout.route";

export const app = express();

import ErrorMiddleware from "./middleware/error";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors
app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/layout", layoutRoutes);

// testing api
app.get("/health", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
    });
});

// unknown route handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Route ${req.originalUrl} not found`) as any;
    error.statusCode = 404;
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
});

app.use(ErrorMiddleware);
