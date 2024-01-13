import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

import ErrorMiddleware from "./middleware/error";

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors
app.use(
    cors({
        origin: process.env.ORIGIN,
    })
);

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
