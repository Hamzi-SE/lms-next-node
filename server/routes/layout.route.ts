import express from "express";
import { createLayout } from "../controllers/layout.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.route("/create").post(isAuthenticated, authorizeRoles("admin"), createLayout);

export default router;
