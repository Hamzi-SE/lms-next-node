import express from "express";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";

const router = express.Router();

router
    .route("/create")
    .post(updateAccessToken, isAuthenticated, authorizeRoles("admin"), createLayout);

router
    .route("/edit")
    .put(updateAccessToken, isAuthenticated, authorizeRoles("admin"), editLayout);

router.route("/").get(getLayoutByType);

export default router;
