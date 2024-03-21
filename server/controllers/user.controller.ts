import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import User, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import {
    accessTokenOptions,
    createActivationToken,
    refreshTokenOptions,
    sendToken,
} from "../utils/jwt";
import { sendEmail } from "../utils/sendMail";
import { redis } from "../utils/redis";
import {
    getAllUsersService,
    getUserById,
    updateUserRoleService,
} from "../services/user.services";
import cloudinary from "cloudinary";

// Register a user => /api/v1/user/register
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

// Activate user account => /api/v1/user/activate
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

// Login user => /api/v1/user/login
interface ILoginUserRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export const loginUser = catchAsyncErrors(
    async (req: ILoginUserRequest, res: Response, next: NextFunction) => {
        const { email, password } = req.body;

        // check if email and password is entered by user
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email & password", 400));
        }

        // finding user in database
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        // check if password is correct or not
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password", 401));
        }

        sendToken(user, 200, res);
    }
);

// Logout user => /api/v1/user/logout
export const logoutUser = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        res.cookie("access_token", "", { maxAge: 1 }); // maxAge: 1 => expires immediately
        res.cookie("refresh_token", "", { maxAge: 1 });

        redis.del(req.user?._id);

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
);

// Update access token => /api/v1/user/refresh-token
export const updateAccessToken = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refresh_token as string;

        const decoded = jwt.verify(
            refreshToken,
            (process.env.JWT_REFRESH_SECRET as string) || "refreshSecret"
        ) as JwtPayload;

        if (!decoded) {
            return next(new ErrorHandler("Invalid refresh token", 401));
        }

        const session = await redis.get(decoded.id);

        if (!session) {
            return next(new ErrorHandler("Session expired, please login again", 401));
        }

        const user = JSON.parse(session);

        const accessToken = jwt.sign(
            { id: user._id },
            (process.env.JWT_ACCESS_SECRET as string) || "accessSecret",
            {
                expiresIn: process.env.JWT_ACCESS_TIME || "5m",
            }
        );

        const newRefreshToken = jwt.sign(
            {
                id: user._id,
            },
            (process.env.JWT_REFRESH_SECRET as string) || "refreshSecret",
            {
                expiresIn: process.env.JWT_REFRESH_TIME || "3d",
            }
        );

        req.user = user;

        res.cookie("access_token", accessToken, accessTokenOptions);
        res.cookie("refresh_token", newRefreshToken, refreshTokenOptions);

        await redis.set(user._id, JSON.stringify(user), "EX", 604800); // 7 days

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            accessToken,
        });
    }
);

// Get currently logged in user details => /api/v1/user/me
export const getUserProfile = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req?.user?._id;
        getUserById(userId, res);
    }
);

// Social auth => /api/v1/user/social-auth
interface ISocialAuthRequest extends Request {
    body: {
        name: string;
        email: string;
        avatar: string;
    };
}
export const socialAuth = catchAsyncErrors(
    async (req: ISocialAuthRequest, res: Response, next: NextFunction) => {
        const { name, email, avatar } = req.body;

        // check if email already exists
        const user = await User.findOne({ email });

        if (user) {
            sendToken(user, 200, res);
        } else {
            const newUser = await User.create({
                name,
                email,
                avatar: {
                    public_id: "social-avatar",
                    url: avatar,
                },
            });

            sendToken(newUser, 200, res);
        }
    }
);

// Update user info => /api/v1/user/update-profile
interface IUpdateProfileRequest extends Request {
    body: {
        name: string;
    };
}
export const updateProfile = catchAsyncErrors(
    async (req: IUpdateProfileRequest, res: Response, next: NextFunction) => {
        const newUserData = {
            name: req.body.name,
        };

        const user = await User.findByIdAndUpdate(req.user?._id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        // update user in redis
        await redis.set(req.user?._id, JSON.stringify(user));

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user,
        });
    }
);

// Update user password => /api/v1/user/update-password
interface IUpdatePasswordRequest extends Request {
    body: {
        oldPassword: string;
        newPassword: string;
    };
}
export const updatePassword = catchAsyncErrors(
    async (req: IUpdatePasswordRequest, res: Response, next: NextFunction) => {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return next(new ErrorHandler("Please enter old and new password", 400));
        }

        // check if old password is correct
        const user = await User.findById(req.user?._id).select("+password");

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (user?.password === undefined) {
            return next(
                new ErrorHandler(
                    "Can not change password because you logged in using your social account",
                    400
                )
            );
        }

        const isPasswordMatched = await user?.comparePassword(oldPassword);

        if (!isPasswordMatched) {
            return next(new ErrorHandler("Old password is incorrect", 400));
        }

        if (oldPassword === newPassword) {
            return next(
                new ErrorHandler("New password can not be the same as old password", 400)
            );
        }

        user.password = newPassword;
        await user.save();

        // update user in redis
        await redis.set(req.user?._id, JSON.stringify(user));

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
            user,
        });
    }
);

// Update user avatar => /api/v1/user/update-avatar
interface IUpdateAvatarRequest extends Request {
    body: {
        avatar: string;
    };
}
export const updateAvatar = catchAsyncErrors(
    async (req: IUpdateAvatarRequest, res: Response, next: NextFunction) => {
        if (!req.body.avatar) {
            return next(new ErrorHandler("Please upload an image", 400));
        }

        const userId = req.user?._id;

        const user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (user.avatar) {
            // if user has an avatar, delete it from cloudinary and upload new one
            if (user?.avatar?.public_id) {
                // delete previous image from cloudinary
                await cloudinary.v2.uploader.destroy(user.avatar.public_id);

                // upload new image to cloudinary
                const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                    folder: "lms-next-node-avatars",
                    width: 150,
                    crop: "scale",
                });

                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            } else {
                const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                    folder: "lms-next-node-avatars",
                    width: 150,
                    crop: "scale",
                });

                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
        }

        await user.save();

        // update user in redis
        await redis.set(req.user?._id, JSON.stringify(user));

        res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            user,
        });
    }
);

// Get all users - only admin => /api/v1/user/admin-all
export const getAllUsersAdmin = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        getAllUsersService(res);
    }
);

// Update user role - only admin => /api/v1/user/update-role
interface IUpdateUserRoleRequest extends Request {
    body: {
        role: string;
        id: string;
    };
}
export const updateUserRole = catchAsyncErrors(
    async (req: IUpdateUserRoleRequest, res: Response, next: NextFunction) => {
        const { role, id } = req.body;

        updateUserRoleService(res, id, role);
    }
);

// Delete user - only admin => /api/v1/user/delete/:id
export const deleteUserAdmin = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        // delete user avatar from cloudinary
        if (user.avatar?.public_id) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }

        await user.deleteOne({ _id: userId });

        // update user in redis
        await redis.del(userId);

        res.status(200).json({
            success: true,
            message: `User (${user.name}) deleted successfully`,
        });
    }
);
