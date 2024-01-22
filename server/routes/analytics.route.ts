import express from "express";
import {
    getCoursesAnalytics,
    getOrdersAnalytics,
    getUsersAnalytics,
} from "../controllers/analytics.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.route("/users").get(isAuthenticated, authorizeRoles("admin"), getUsersAnalytics);

router.route("/courses").get(isAuthenticated, authorizeRoles("admin"), getCoursesAnalytics);

router.route("/orders").get(isAuthenticated, authorizeRoles("admin"), getOrdersAnalytics);

export default router;
