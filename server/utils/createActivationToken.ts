import jwt, { Secret } from "jsonwebtoken";
import { IUser } from "../models/user.model";

interface IActivationToken {
    token: string;
    activationCode: string;
}

export const createActivationToken = (user: IUser): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit number

    const token = jwt.sign({ user, activationCode }, process.env.ACTIVATION_SECRET as Secret, {
        expiresIn: "10m",
    });

    return { token, activationCode };
};
