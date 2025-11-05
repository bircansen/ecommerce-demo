import { Router } from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/Auth.js";

const router = Router();

// Kullanıcının sepetini getir
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Sepet getirilemedi", err });
  }
});

// Sepete ürün ekle
router.post("/add", authMiddleware, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const existing = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Sepete eklenemedi", err });
  }
});

// Sepetten ürün çıkar
router.post("/remove", authMiddleware, async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );
    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Sepetten çıkarılamadı", err });
  }
});

// Sepeti temizle
router.post("/clear", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: "Sepet temizlenemedi", err });
  }
});

export default router;
