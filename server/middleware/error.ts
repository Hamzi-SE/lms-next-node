import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

const ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // wrong mongoose object id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // duplicate mongoose key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = "JSON web token is invalid, try again";
        err = new ErrorHandler(message, 400);
    }

    // expired jwt error
    if (err.name === "TokenExpiredError") {
        const message = "JSON web token is expired, try again";
        err = new ErrorHandler(message, 400);
    }

    // validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value: any) => value.message);
        err = new ErrorHandler(message[0], 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        // in development mode, we want to see the stack trace
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
};

export default ErrorMiddleware;
