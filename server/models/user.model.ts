import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emailRegexPattern: RegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>;
    signAccessToken: () => string;
    signRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            maxLength: [99, "Your name cannot exceed 99 characters"],
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            validate: {
                validator: (email: string) => emailRegexPattern.test(email),
                message: "Please enter a valid email",
            },
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            minLength: [6, "Your password must be at least 6 characters long"],
            select: false,
        },
        avatar: {
            public_id: String,
            url: String,
        },
        role: {
            type: String,
            default: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        courses: [
            {
                courseId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Course",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Hashing password before saving
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Sign JWT access token
userSchema.methods.signAccessToken = function (): string {
    return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_SECRET || "accessSecret");
};

// Sign JWT refresh token
userSchema.methods.signRefreshToken = function (): string {
    return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET || "refreshSecret");
};

// Compare user password
userSchema.methods.comparePassword = async function (
    enteredPassword: string
): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> = mongoose.model("User", userSchema);

export default User;
