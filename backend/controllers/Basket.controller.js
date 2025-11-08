// controllers/Basket.controller.js
import User from "../models/User.js";
import Product from "../models/Product.js";

/**
 * GET /api/basket/:userId
 * Dönen: { cart: [...] }   (cart içindeki item.productId populate edilmiş)
 */
export const getBasket = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("cart.productId");
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    return res.json({ cart: user.cart });
  } catch (err) {
    console.error("getBasket error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/basket/add
 * body: { userId, productId }
 * Eğer item varsa quantity++, yoksa yeni item ekle
 * Dönen: { cart: [...] }
 */
export const addToBasket = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId)
      return res.status(400).json({ message: "Eksik veri" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });

    const existingItem = user.cart.find(
      (it) => it.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();
    // populate before return
    await user.populate("cart.productId");
    return res.json({ cart: user.cart });
  } catch (err) {
    console.error("addToBasket error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/basket/decrease
 * body: { userId, productId }
 * Eğer quantity>1 -> azalt, quantity==1 ise kaldır
 * Dönen: { cart: [...] }
 */
export const decreaseQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId)
      return res.status(400).json({ message: "Eksik veri" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    const item = user.cart.find((it) => it.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: "Ürün sepette yok" });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      user.cart = user.cart.filter(
        (it) => it.productId.toString() !== productId
      );
    }

    await user.save();
    await user.populate("cart.productId");
    return res.json({ cart: user.cart });
  } catch (err) {
    console.error("decreaseQuantity error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/basket/remove
 * body: { userId, productId }
 * Ürünü tamamen kaldırır
 * Dönen: { cart: [...] }
 */
export const removeFromBasket = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId)
      return res.status(400).json({ message: "Eksik veri" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    user.cart = user.cart.filter((it) => it.productId.toString() !== productId);

    await user.save();
    await user.populate("cart.productId");
    return res.json({ cart: user.cart });
  } catch (err) {
    console.error("removeFromBasket error:", err);
    return res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/basket/clear
 * body: { userId }
 * Sepeti tamamen temizler
 * Dönen: { message: "Basket cleared", cart: [] }
 */
export const clearBasket = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "Eksik veri" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    user.cart = [];
    await user.save();
    return res.json({ message: "Basket cleared", cart: [] });
  } catch (err) {
    console.error("clearBasket error:", err);
    return res.status(500).json({ message: err.message });
  }
};
