import express from "express";
import { getNotifications, updateNotification } from "../controllers/notification.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";

const router = express.Router();

router
    .route("/")
    .get(updateAccessToken, isAuthenticated, authorizeRoles("admin"), getNotifications);
router
    .route("/update/:id")
    .put(updateAccessToken, isAuthenticated, authorizeRoles("admin"), updateNotification);

export default router;
