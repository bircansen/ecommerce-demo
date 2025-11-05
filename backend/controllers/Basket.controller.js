import Basket from "../models/Basket.js";

// GET user basket
export const getBasket = async (req, res) => {
  try {
    const { userId } = req.params;
    const basket = await Basket.find({ userId });
    res.json(basket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD item or increase quantity
export const addToBasket = async (req, res) => {
  try {
    const { userId, productId, title, price } = req.body;

    const exist = await Basket.findOne({ userId, productId });

    if (exist) {
      exist.quantity += 1;
      await exist.save();
      return res.json(exist);
    }

    const newItem = await Basket.create({
      userId,
      productId,
      title,
      price,
      quantity: 1,
    });

    res.json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DECREASE quantity or remove
export const decreaseQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const exist = await Basket.findOne({ userId, productId });

    if (!exist) return res.json({ message: "Item not found" });

    if (exist.quantity > 1) {
      exist.quantity -= 1;
      await exist.save();
      return res.json(exist);
    }

    // quantity 1 ise sil
    await Basket.deleteOne({ userId, productId });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE item
export const removeFromBasket = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    await Basket.deleteOne({ userId, productId });
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CLEAR basket
export const clearBasket = async (req, res) => {
  try {
    const { userId } = req.body;
    await Basket.deleteMany({ userId });
    res.json({ message: "Basket cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
