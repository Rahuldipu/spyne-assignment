import express from "express";
import { currentUser, login, registerUser } from "../controllers/auth.controller.js"
import { verify } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/me", verify, currentUser);

export default router;
