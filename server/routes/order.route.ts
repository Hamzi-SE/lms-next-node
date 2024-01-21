import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrdersAdmin } from "../controllers/order.controller";

const router = express.Router();

router.route("/create").post(isAuthenticated, createOrder);

router.route("/admin-all").get(isAuthenticated, authorizeRoles("admin"), getAllOrdersAdmin);

export default router;
