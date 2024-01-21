import express from "express";
import {
    activateUser,
    getAllUsersAdmin,
    getUserProfile,
    loginUser,
    logoutUser,
    registerUser,
    socialAuth,
    updateAccessToken,
    updateAvatar,
    updatePassword,
    updateProfile,
    updateUserRole,
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

router.route("/update-profile").put(isAuthenticated, updateProfile);
router.route("/update-password").put(isAuthenticated, updatePassword);
router.route("/update-avatar").put(isAuthenticated, updateAvatar);

router.route("/admin-all").get(isAuthenticated, authorizeRoles("admin"), getAllUsersAdmin);

router.route("/update-role").put(isAuthenticated, authorizeRoles("admin"), updateUserRole);

export default router;
