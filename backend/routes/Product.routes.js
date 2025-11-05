import { Router } from "express";
import {
  getAllProducts,
  searchProducts,
  getProductById,
} from "../controllers/Product.controller.js";

const router = Router();

// ✅ /api/products
router.get("/", getAllProducts);

// ✅ /api/products/search
router.get("/search", searchProducts);

// ✅ /api/products/:id
router.get("/:id", getProductById);

export default router;
