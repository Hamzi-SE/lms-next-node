import express from "express";
import {
    activateUser,
    getUserProfile,
    loginUser,
    logoutUser,
    registerUser,
    socialAuth,
    updateAccessToken,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/social-auth").post(socialAuth);
router.route("/activate").post(activateUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticated, logoutUser);

router.route("/refresh-token").get(updateAccessToken);

router.route("/me").get(isAuthenticated, getUserProfile);

export default router;
