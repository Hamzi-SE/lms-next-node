import express from "express";
import {
    activateUser,
    loginUser,
    logoutUser,
    registerUser,
    updateAccessToken,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/activate").post(activateUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticated, logoutUser);

router.route("/refresh-token").get(updateAccessToken);

export default router;
