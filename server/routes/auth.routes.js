import { Router } from "express";
import {
  register,
  login,
  me,
  updateUserProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Registro y login
router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, me);
router.patch("/profile", authMiddleware, updateUserProfile);

export default router;
