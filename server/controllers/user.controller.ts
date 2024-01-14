import { NextFunction, Request, Response } from "express";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import User, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { createActivationToken } from "../utils/createActivationToken";
import ejs from "ejs";
import path from "path";
import { sendEmail } from "../utils/sendMail";

// Register a user => /api/v1/register
interface IRegisterUserRequest extends Request {
    body: {
        name: string;
        email: string;
        password: string;
        avatar?: string;
    };
}

export const registerUser = catchAsyncErrors(
    async (req: IRegisterUserRequest, res: Response, next: NextFunction) => {
        const { name, email, password, avatar } = req.body;

        // check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        // create user
        const user: IUser = await User.create({
            name,
            email,
            password,
        });

        const activationToken = createActivationToken(user);

        const activationCode = activationToken.activationCode;

        const emailData = { user: { name: user.name }, activationCode };

        try {
            await sendEmail({
                email: user.email,
                subject: "Account activation",
                template: "activation-mail",
                data: emailData,
            });

            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account`,
                activationToken: activationToken.token,
            });
        } catch (error: any) {
            // delete user if activation email fails
            await user.deleteOne();

            return next(new ErrorHandler(error.message || "Something went wrong", 500));
        }
    }
);
