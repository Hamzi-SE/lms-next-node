import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import catchAsyncErrors from "../middleware/catchAsyncErrors";
import Layout from "../models/layout.model";
import cloudinary from "cloudinary";

// Create layout => /api/v1/layout/create
export const createLayout = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { type } = req.body;

        if (!type) {
            return next(new ErrorHandler("Layout type is required", 400));
        }

        const typeExists = await Layout.findOne({ type });

        if (typeExists) {
            return next(new ErrorHandler(`${type} already exists`, 400));
        }

        if (type === "Banner") {
            const { image, title, subTitle } = req.body;

            if (!image || !title || !subTitle) {
                return next(new ErrorHandler("Please enter all fields", 400));
            }

            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "lms-next-node-layouts",
            });

            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subTitle,
            };

            const layout = await Layout.create({
                type,
                banner,
            });

            return res.status(201).json({
                success: true,
                message: "Banner created successfully",
                layout,
            });
        }

        if (type === "FAQ") {
            const { faq } = req.body;

            if (!faq) {
                return next(new ErrorHandler("Please enter all fields", 400));
            }

            const faqItems = faq.map((item: any) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            });

            const layout = await Layout.create({
                type,
                faq: faqItems,
            });

            return res.status(201).json({
                success: true,
                message: "FAQ created successfully",
                layout,
            });
        }

        if (type === "Categories") {
            const { categories } = req.body;

            if (!categories) {
                return next(new ErrorHandler("Please enter all fields", 400));
            }

            const categoryItems = categories.map((item: any) => {
                return {
                    title: item.title,
                };
            });

            const layout = await Layout.create({
                type,
                categories: categoryItems,
            });

            return res.status(201).json({
                success: true,
                message: "Category created successfully",
                layout,
            });
        }

        // if we reach here, then the type is not valid
        return next(new ErrorHandler("Invalid layout type", 400));
    }
);

// Edit layout => /api/v1/layout/edit
export const editLayout = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { type } = req.body;

        if (!type) {
            return next(new ErrorHandler("Layout type is required", 400));
        }

        if (type === "Banner") {
            const { image, title, subTitle } = req.body;

            const bannerData = await Layout.findOne({ type });

            if (!bannerData) {
                return next(new ErrorHandler("Banner layout not found", 404));
            }

            // delete old image from cloudinary
            await cloudinary.v2.uploader.destroy(bannerData.banner?.image?.public_id);

            // upload new image to cloudinary
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "lms-next-node-layouts",
            });

            const banner = {
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
                title,
                subTitle,
            };

            const layout = await Layout.findOneAndUpdate(
                { type },
                {
                    banner,
                },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }
            );

            return res.status(200).json({
                success: true,
                message: "Banner updated successfully",
                layout,
            });
        }

        if (type === "FAQ") {
            const { faq } = req.body;

            const faqData = await Layout.findOne({ type });

            if (!faqData) {
                return next(new ErrorHandler("FAQ layout not found", 404));
            }

            const faqItems = faq.map((item: any) => {
                return {
                    question: item.question,
                    answer: item.answer,
                };
            });

            const layout = await Layout.findOneAndUpdate(
                { type },
                {
                    faq: faqItems,
                },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }
            );

            return res.status(200).json({
                success: true,
                message: "FAQ updated successfully",
                layout,
            });
        }

        if (type === "Categories") {
            const { categories } = req.body;

            const categoriesData = await Layout.findOne({ type });

            if (!categoriesData) {
                return next(new ErrorHandler("Categories layout not found", 404));
            }

            const categoryItems = categories.map((item: any) => {
                return {
                    title: item.title,
                };
            });

            const layout = await Layout.findOneAndUpdate(
                { type },
                {
                    categories: categoryItems,
                },
                {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false,
                }
            );

            return res.status(200).json({
                success: true,
                message: "Categories updated successfully",
                layout,
            });
        }

        // if we reach here, then the type is not valid
        return next(new ErrorHandler("Invalid layout type", 400));
    }
);
