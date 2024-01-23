import express from "express";
import { createLayout, editLayout, getLayoutByType } from "../controllers/layout.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.route("/create").post(isAuthenticated, authorizeRoles("admin"), createLayout);

router.route("/edit").put(isAuthenticated, authorizeRoles("admin"), editLayout);

router.route("/").get(getLayoutByType);

export default router;
