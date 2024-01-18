import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit number

    const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET as Secret, {
        expiresIn: "10m",
    });

    return { token, activationCode };
};

interface ITokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "none" | "strict" | "lax" | undefined;
    secure?: boolean;
}

export const sendToken = (
    user: IUser,
    statusCode: number,
    res: Response,
    tokenOptions?: ITokenOptions
) => {
    const accessToken = user.signAccessToken();
    const refreshToken = user.signRefreshToken();

    // upload session to redis
    redis.set(user._id, JSON.stringify(user) as any);

    // parse environment variables to integrate with fallback values
    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10);
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10);

    // options for cookies
    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: "lax",
        ...tokenOptions,
    };

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire * 1000),
        maxAge: refreshTokenExpire * 1000,
        httpOnly: true,
        sameSite: "lax",
        ...tokenOptions,
    };

    // set secure flag to true in production
    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true;
    }

    // set cookies
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    // send response
    res.status(statusCode).json({
        success: true,
        accessToken,
        user,
    });
};
