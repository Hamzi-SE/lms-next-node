import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOder extends Document {
    courseId: string;
    userId: string;
    payment_info: object;
}

const orderSchema = new Schema<IOder>(
    {
        courseId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        payment_info: {
            type: Object,
            // required: true
        },
    },
    {
        timestamps: true,
    }
);

const Order: Model<IOder> = mongoose.model("Order", orderSchema);

export default Order;
