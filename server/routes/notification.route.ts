import express from "express";
import { getNotifications, updateNotification } from "../controllers/notification.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.route("/").get(isAuthenticated, authorizeRoles("admin"), getNotifications);
router.route("/update/:id").put(isAuthenticated, authorizeRoles("admin"), updateNotification);

export default router;
