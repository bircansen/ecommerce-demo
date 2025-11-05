// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Route imports
import authRoutes from "./routes/Auth.routes.js";
import productRoutes from "./routes/Product.routes.js";
import favoritesRoutes from "./routes/Favorites.routes.js";
import cartRoutes from "./routes/Cart.routes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Public files
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));
app.use("/api/cart", cartRoutes);
// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes); // ✅ ÜRÜNLER
app.use("/api/favorites", favoritesRoutes); // ✅ FAVORİLER

// ✅ MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "ecommerce" })
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

// ✅ Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
