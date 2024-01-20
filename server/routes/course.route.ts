import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { uploadCourse, updateCourse } from "../controllers/course.controller";

const router = express.Router();

router.route("/create").post(isAuthenticated, authorizeRoles("admin"), uploadCourse);

router.route("/update/:id").put(isAuthenticated, authorizeRoles("admin"), updateCourse);

export default router;
