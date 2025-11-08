// routes/Basket.routes.js
import express from "express";
import {
  getBasket,
  addToBasket,
  decreaseQuantity,
  removeFromBasket,
  clearBasket,
} from "../controllers/Basket.controller.js";

const router = express.Router();

// ✅ 1) Önce POST endpointlerini tanımlıyoruz
router.post("/add", addToBasket);
router.post("/decrease", decreaseQuantity);
router.post("/remove", removeFromBasket);
router.post("/clear", clearBasket);

// ✅ 2) EN SON GET route geliyor
router.get("/:userId", getBasket);

export default router;
