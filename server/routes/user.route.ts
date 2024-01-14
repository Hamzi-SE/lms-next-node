import express from "express";
import { activateUser, registerUser } from "../controllers/user.controller";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/activate").post(activateUser);

export default router;
