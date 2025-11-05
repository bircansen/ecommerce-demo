import { Router } from "express";
import {
  getBasket,
  addToBasket,
  decreaseQuantity,
  removeFromBasket,
  clearBasket,
} from "../controllers/Basket.controller.js";

const router = Router();

router.get("/:userId", getBasket);
router.post("/add", addToBasket);
router.post("/decrease", decreaseQuantity);
router.post("/remove", removeFromBasket);
router.post("/clear", clearBasket);

export default router;
