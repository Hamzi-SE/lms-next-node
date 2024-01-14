import express from "express";
import { registerUser } from "../controllers/user.controller";

const router = express.Router();

router.route("/register").post(registerUser);

export default router;
