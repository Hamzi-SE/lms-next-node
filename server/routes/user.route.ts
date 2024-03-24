import express from "express";
import {
    activateUser,
    deleteUserAdmin,
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

router.route("/me").get(updateAccessToken, isAuthenticated, getUserProfile);

router.route("/update-profile").put(updateAccessToken, isAuthenticated, updateProfile);
router.route("/update-password").put(updateAccessToken, isAuthenticated, updatePassword);
router.route("/update-avatar").put(updateAccessToken, isAuthenticated, updateAvatar);

router
    .route("/admin-all")
    .get(updateAccessToken, isAuthenticated, authorizeRoles("admin"), getAllUsersAdmin);

router
    .route("/update-role")
    .put(updateAccessToken, isAuthenticated, authorizeRoles("admin"), updateUserRole);

router
    .route("/delete/:id")
    .delete(updateAccessToken, isAuthenticated, authorizeRoles("admin"), deleteUserAdmin);

export default router;
