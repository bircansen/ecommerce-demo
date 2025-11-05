import { Router } from "express";
import {
  register,
  login,
  updateProfile,
  updatePassword,
} from "../controllers/Auth.controller.js";
import authMiddleware from "../middleware/Auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.put("/profile", authMiddleware, updateProfile);
router.put("/password", authMiddleware, updatePassword);

export default router;
