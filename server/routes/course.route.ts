import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
    uploadCourse,
    updateCourse,
    getSingleCourse,
    getAllCourses,
    getCourseByUser,
    addQuestion,
    addAnswer,
    addReview,
    addReplyToReview,
    getAllCoursesAdmin,
    deleteCourseAdmin,
    generateVideoUrl,
} from "../controllers/course.controller";

const router = express.Router();

router.route("/create").post(isAuthenticated, authorizeRoles("admin"), uploadCourse);

router.route("/update/:id").put(isAuthenticated, authorizeRoles("admin"), updateCourse);

router.route("/single/:id").get(getSingleCourse);

router.route("/all").get(getAllCourses);

router.route("/admin-all").get(isAuthenticated, authorizeRoles("admin"), getAllCoursesAdmin);

router.route("/content/:id").get(isAuthenticated, getCourseByUser);

router.route("/add-question").put(isAuthenticated, addQuestion);

router.route("/add-answer").put(isAuthenticated, addAnswer);

router.route("/add-review/:id").put(isAuthenticated, addReview);

router
    .route("/add-review-reply")
    .put(isAuthenticated, authorizeRoles("admin"), addReplyToReview);

router
    .route("/delete/:id")
    .delete(isAuthenticated, authorizeRoles("admin"), deleteCourseAdmin);

router.post("/get-vdo-cipher-otp", generateVideoUrl);

export default router;
