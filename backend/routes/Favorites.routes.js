import { Router } from "express";
import {
  getFavorites,
  toggleFavorite,
} from "../controllers/Favorites.controller.js";
import authMiddleware from "../middleware/Auth.js";

const router = Router();

router.get("/", authMiddleware, getFavorites); // Kullanıcının favorilerini getir
router.post("/:productId", authMiddleware, toggleFavorite); // Favori ekle/çıkar

export default router;
