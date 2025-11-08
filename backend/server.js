import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/Auth.routes.js";
import productRoutes from "./routes/Product.routes.js";
import favoritesRoutes from "./routes/Favorites.routes.js";
import basketRoutes from "./routes/Basket.routes.js";

dotenv.config();

const app = express();

// File paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Static
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

// ✅ API Routes (sıranın bir önemi yok ama temizlik için böyle)
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/basket", basketRoutes); // ✅ Basket route doğru yerde

// ✅ MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "ecommerce" })
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
