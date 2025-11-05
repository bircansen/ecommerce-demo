// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Amazon dataset tipik alanları
    asin: String,
    title: { type: String, required: true },
    price_value: Number,
    about_item: String,
    product_description: String,
    brand_name: String,
    brand_page_url: String,
    breadcrumbs: String,
    availability: String,
    best_sellers_rank: String,
    default_variant: [String],
    delivery_date: String,
    fastest_delivery_date: String,
    manufacturer: String,
    model_number: String,
    rating_stars: String, // örn "4.6 out of 5 stars"
    rating_count: String, // örn "305,325 ratings"
    rating_distribution: Object, // tutmak istersen { "1star": "2%", ... }
    recent_purchases: String,
    scrape_time: String,
    seller_name: String,
    product_url: String,
    all_images: [String], // array of image URLs
    // Eski fakestore format için kalanlar (uyumluluk)
    price: Number,
    description: String,
    image: String,
  },
  { timestamps: true }
);

// Eğer koleksiyonunda MongoDB tarafında already `_id` var ise mongoose bunu otomatik kullanır.
export default mongoose.model("Product", productSchema);
