import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Kayıt ol
export const register = async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email zaten kayıtlı" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage: profileImage || "/avatars/avatar1.png",
    });

    await newUser.save();

    res.status(201).json({
      message: "Kayıt başarılı",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser.profileImage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Giriş yap
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email veya şifre hatalı" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Email veya şifre hatalı" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Giriş başarılı",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Profil güncelle
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, profileImage },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    res.status(200).json({
      message: "Profil güncellendi",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// ✅ Şifre güncelle
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid)
      return res.status(400).json({ message: "Mevcut şifre hatalı" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Şifre güncellendi" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
