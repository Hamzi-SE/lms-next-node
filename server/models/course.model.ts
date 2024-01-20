import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

interface IComment extends Document {
    user: IUser;
    question: string;
    questionReplies?: IComment[];
}

interface IReview extends Document {
    user: object;
    rating: number;
    comment: string;
}

interface ILink extends Document {
    title: string;
    url: string;
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail: object;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}

interface ICourse extends Document {
    name: string;
    description: string;
    price: number;
    estimatedPrice: number;
    thumbnail: {
        public_id: string;
        url: string;
    };
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
}

const reviewSchema = new Schema<IReview>(
    {
        user: Object,
        rating: {
            type: Number,
            default: 0,
        },
        comment: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const linkSchema = new Schema<ILink>(
    {
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const commentSchema = new Schema<IComment>(
    {
        user: Object,
        question: {
            type: String,
            required: true,
        },
        questionReplies: [Object],
    },
    { timestamps: true }
);

const courseDataSchema = new Schema<ICourseData>(
    {
        videoUrl: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        videoSection: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        videoLength: {
            type: Number,
            required: true,
        },
        videoPlayer: {
            type: String,
        },
        links: [linkSchema],
        suggestion: {
            type: String,
        },
        questions: [commentSchema],
    },
    { timestamps: true }
);

const courseSchema = new Schema<ICourse>(
    {
        name: {
            type: String,
            required: [true, "Please enter course name"],
            maxLength: [200, "Course name cannot exceed 200 characters"],
        },
        description: {
            type: String,
            required: [true, "Please enter course description"],
        },
        price: {
            type: Number,
            required: [true, "Please enter course price"],
        },
        estimatedPrice: {
            type: Number,
        },
        thumbnail: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
        tags: {
            type: String,
            required: [true, "Please enter course tags"],
        },
        level: {
            type: String,
            required: [true, "Please enter course level"],
        },
        demoUrl: {
            type: String,
            required: [true, "Please enter course demo url"],
        },
        benefits: [
            {
                title: {
                    type: String,
                    required: true,
                },
            },
        ],
        prerequisites: [
            {
                title: {
                    type: String,
                    required: true,
                },
            },
        ],
        reviews: [reviewSchema],
        courseData: [courseDataSchema],
        ratings: {
            type: Number,
            default: 0,
        },
        purchased: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Course: Model<ICourse> = mongoose.model("Course", courseSchema);

export default Course;
