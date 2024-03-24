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
import { updateAccessToken } from "../controllers/user.controller";

const router = express.Router();

router
    .route("/create")
    .post(updateAccessToken, isAuthenticated, authorizeRoles("admin"), uploadCourse);

router
    .route("/update/:id")
    .put(updateAccessToken, isAuthenticated, authorizeRoles("admin"), updateCourse);

router.route("/single/:id").get(getSingleCourse);

router.route("/all").get(getAllCourses);

router
    .route("/admin-all")
    .get(updateAccessToken, isAuthenticated, authorizeRoles("admin"), getAllCoursesAdmin);

router.route("/content/:id").get(updateAccessToken, isAuthenticated, getCourseByUser);

router.route("/add-question").put(updateAccessToken, isAuthenticated, addQuestion);

router.route("/add-answer").put(updateAccessToken, isAuthenticated, addAnswer);

router.route("/add-review/:id").put(updateAccessToken, isAuthenticated, addReview);

router
    .route("/add-review-reply")
    .put(updateAccessToken, isAuthenticated, authorizeRoles("admin"), addReplyToReview);

router
    .route("/delete/:id")
    .delete(updateAccessToken, isAuthenticated, authorizeRoles("admin"), deleteCourseAdmin);

router.post("/get-vdo-cipher-otp", generateVideoUrl);

export default router;
