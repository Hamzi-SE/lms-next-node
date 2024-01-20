import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
    uploadCourse,
    updateCourse,
    getSingleCourse,
    getAllCourses,
} from "../controllers/course.controller";

const router = express.Router();

router.route("/create").post(isAuthenticated, authorizeRoles("admin"), uploadCourse);

router.route("/update/:id").put(isAuthenticated, authorizeRoles("admin"), updateCourse);

router.route("/single/:id").get(getSingleCourse);

router.route("/all").get(getAllCourses);

export default router;
