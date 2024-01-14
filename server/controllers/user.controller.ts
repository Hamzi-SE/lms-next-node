import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import User, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { createActivationToken } from "../utils/createActivationToken";
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

        const user: IRegisterUserRequest["body"] = {
            name,
            email,
            password,
        };

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
            return next(new ErrorHandler(error.message || "Something went wrong", 500));
        }
    }
);

// Activate user account => /api/v1/activation
interface IActivateUserRequest extends Request {
    body: {
        activation_token: string;
        activation_code: string;
    };
}

export const activateUser = catchAsyncErrors(
    async (req: IActivateUserRequest, res: Response, next: NextFunction) => {
        const { activation_token, activation_code } = req.body;

        const newUser: { user: IUser; activationCode: string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET!
        ) as { user: IUser; activationCode: string };

        if (newUser.activationCode !== activation_code) {
            return next(new ErrorHandler("Invalid activation code", 400));
        }

        const { name, email, password } = newUser.user;

        // check if email already exists
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return next(new ErrorHandler("Email already exists", 400));
        }

        // create user
        await User.create({
            name,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            message: "Account activated successfully",
        });
    }
);
