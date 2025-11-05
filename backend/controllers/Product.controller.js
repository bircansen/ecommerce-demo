// controllers/Product.controller.js
import Product from "../models/Product.js";

/**
 * normalizeProduct:
 * MongoDB ürününü frontend için tek tipe dönüştürür.
 * Favorites, ProductList, ProductDetails hepsi bu formatı kullanır.
 */
export function normalizeProduct(p) {
  if (!p) return null;

  const id = p._id?.toString ? p._id.toString() : p._id;

  // ✅ all_images hem array hem string gelebilir
  let images = [];
  if (Array.isArray(p.all_images)) {
    images = p.all_images;
  } else if (typeof p.all_images === "string") {
    try {
      const parsed = JSON.parse(p.all_images.replace(/'/g, '"'));
      if (Array.isArray(parsed)) images = parsed;
    } catch {
      images = [];
    }
  }

  // ✅ görüntü seçimi
  const image =
    images.length > 0
      ? images[0]
      : p.image && typeof p.image === "string"
      ? p.image
      : null;

  // ✅ normalize edilmiş tek ürün objesi
  return {
    id, // frontend → item.id
    asin: p.asin || null,
    title: p.title || p.product_title || null,

    // ✅ Fiyat normalize
    price:
      typeof p.price_value === "object" && p.price_value?.$numberDecimal
        ? parseFloat(p.price_value.$numberDecimal)
        : p.price_value ?? p.price ?? null,

    // ✅ Açıklama normalize
    description: p.about_item || p.product_description || p.description || null,

    image, // ✅ ana görsel
    images, // ✅ diğer tüm görseller

    // ✅ diğer alanlar
    brand: p.brand_name || null,
    rating: p.rating_stars || null,
    ratingCount: p.rating_count || null,
    productUrl: p.product_url || null,
    availability: p.availability || null,
    breadcrumbs: p.breadcrumbs || null,
    seller: p.seller_name || null,
    scrapeTime: p.scrape_time || null,
  };
}

/**
 * GET /api/products
 * Pagination + normalize
 */
export const getAllProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(200, parseInt(req.query.limit || "24", 10));
    const skip = (page - 1) * limit;

    const filter = {};

    // ✅ fiyat filtreleme
    if (req.query.minPrice) {
      filter.$expr = {
        $gte: [
          { $ifNull: ["$price_value", "$price"] },
          Number(req.query.minPrice),
        ],
      };
    }

    if (req.query.maxPrice) {
      filter.$expr = filter.$expr || {};
      filter.$expr = {
        $and: [
          filter.$expr,
          {
            $lte: [
              { $ifNull: ["$price_value", "$price"] },
              Number(req.query.maxPrice),
            ],
          },
        ],
      };
    }

    const products = await Product.find(filter).skip(skip).limit(limit).lean();
    const normalized = products.map(normalizeProduct);
    const total = await Product.countDocuments(filter);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: normalized,
    });
  } catch (err) {
    console.error("getAllProducts error:", err);
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

/**
 * GET /api/products/:id
 * Tek ürün detay
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı." });
    }

    const normalized = normalizeProduct(product);
    res.json(normalized);
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};

/**
 * GET /api/products/search?q=...
 * Metin bazlı arama + normalize
 */
export const searchProducts = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res
        .status(400)
        .json({ message: "Arama sorgusu boş olamaz. ?q=... gönderin." });
    }

    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(200, parseInt(req.query.limit || "24", 10));
    const skip = (page - 1) * limit;

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const query = {
      $or: [
        { title: { $regex: regex } },
        { about_item: { $regex: regex } },
        { product_description: { $regex: regex } },
        { breadcrumbs: { $regex: regex } },
        { brand_name: { $regex: regex } },
        { asin: { $regex: regex } },
      ],
    };

    const products = await Product.find(query).skip(skip).limit(limit).lean();
    const normalized = products.map(normalizeProduct);

    const total = await Product.countDocuments(query);

    res.json({
      q,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: normalized,
    });
  } catch (err) {
    console.error("searchProducts error:", err);
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};
