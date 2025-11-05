import mongoose from "mongoose";

const basketSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // login yoksa "guest"
  productId: { type: String, required: true },
  title: String,
  price: Number,
  quantity: Number,
});

export default mongoose.model("Basket", basketSchema);
