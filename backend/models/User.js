import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "/avatars/avatar1.png" },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // ✅ eklendi
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ], // ✅ sepete ekledik
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
