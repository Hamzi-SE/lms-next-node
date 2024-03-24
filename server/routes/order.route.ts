import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrdersAdmin } from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";

const router = express.Router();

router.route("/create").post(updateAccessToken, isAuthenticated, createOrder);

router
    .route("/admin-all")
    .get(updateAccessToken, isAuthenticated, authorizeRoles("admin"), getAllOrdersAdmin);

export default router;
