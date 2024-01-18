import express from "express";
import {
    activateUser,
    loginUser,
    logoutUser,
    registerUser,
} from "../controllers/user.controller";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/activate").post(activateUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

export default router;
