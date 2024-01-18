import express from "express";
import {
    activateUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/activate").post(activateUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticated, logoutUser);

export default router;
