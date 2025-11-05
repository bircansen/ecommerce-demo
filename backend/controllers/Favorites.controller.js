// controllers/Favorites.controller.js
import User from "../models/User.js";
import Product from "../models/Product.js";
import { normalizeProduct } from "./Product.controller.js";

/**
 * ✅ FAVORİLERİ GETİR (normalize + lean)
 */
export const getFavorites = async (req, res) => {
  try {
    // ✅ populate ile ürünleri getiriyoruz + lean() ile düz JSON yapıyoruz
    const user = await User.findById(req.user.id)
      .populate({
        path: "favourites",
        model: "Product",
      })
      .lean(); // ✅ MÜKEMMEL: normalize doğru çalışır

    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    // ✅ normalize edilmiş ürün listesi
    const normalized = user.favourites.map((p) => normalizeProduct(p));

    return res.status(200).json(normalized);
  } catch (err) {
    console.error("getFavorites ERROR:", err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

/**
 * ✅ FAVORİ EKLE / ÇIKAR
 */
export const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    // ✅ varsa çıkar
    if (user.favourites.includes(productId)) {
      user.favourites.pull(productId);
    }

    // ✅ yoksa ekle
    else {
      user.favourites.push(productId);
    }

    await user.save();

    // ✅ güncel favorileri tekrar populate + lean ile getiriyoruz
    const updated = await User.findById(req.user.id)
      .populate({
        path: "favourites",
        model: "Product",
      })
      .lean();

    // ✅ normalize edilmiş tam ürün listesi
    const normalized = updated.favourites.map((p) => normalizeProduct(p));

    return res.status(200).json(normalized);
  } catch (err) {
    console.error("toggleFavorite ERROR:", err);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};
